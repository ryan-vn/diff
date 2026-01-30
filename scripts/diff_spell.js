#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function parseVersion(filePath) {
  const base = path.basename(filePath);
  const m = base.match(/Spell\.([0-9.]+)\.csv/);
  return m ? m[1] : null;
}

function getArg(args, name, fallback) {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  return args[idx + 1] ?? fallback;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") {
        i += 1;
      }
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function normalizeRow(row) {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    out[k] = v ?? "";
  }
  if (Object.prototype.hasOwnProperty.call(out, "ID") && out.ID !== "") {
    if (/^\d+$/.test(String(out.ID))) {
      out.ID = Number(out.ID);
    }
  }
  return out;
}

function readCsv(filePath, encoding) {
  let text = fs.readFileSync(filePath, { encoding });
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  const rows = parseCsv(text).filter((r) => r.some((v) => v !== ""));
  if (rows.length === 0) {
    throw new Error(`No rows in ${filePath}`);
  }

  const header = rows[0].map((h) => h.trim());
  const dataRows = rows.slice(1);

  const data = {};
  const duplicates = [];

  for (const r of dataRows) {
    const row = {};
    for (let i = 0; i < header.length; i++) {
      row[header[i]] = r[i] ?? "";
    }
    const idVal = row.ID || row.Id || row.id;
    if (idVal === undefined || idVal === "") continue;
    const key = String(idVal);
    if (data[key]) duplicates.push(key);
    data[key] = row;
  }

  return { rows: data, header, duplicates };
}

function buildSpellNameMap(filePath, encoding) {
  if (!filePath || !fs.existsSync(filePath)) {
    return { map: {}, duplicates: [], path: null };
  }
  const data = readCsv(filePath, encoding);
  const map = {};
  for (const [id, row] of Object.entries(data.rows)) {
    const name = row.Name_lang ?? row.Name ?? row.name ?? "";
    map[id] = name ?? "";
  }
  return { map, duplicates: data.duplicates, path: filePath };
}

function buildDiff(oldRows, newRows, header, nameOld, nameNew, useSpellName) {
  const fields = header.filter((f) => !["ID", "Id", "id"].includes(f));
  const oldIds = new Set(Object.keys(oldRows));
  const newIds = new Set(Object.keys(newRows));

  const addedIds = [...newIds].filter((x) => !oldIds.has(x)).sort(sortId);
  const deletedIds = [...oldIds].filter((x) => !newIds.has(x)).sort(sortId);
  const commonIds = [...oldIds].filter((x) => newIds.has(x)).sort(sortId);

  const added = addedIds.map((id) => {
    const row = normalizeRow(newRows[id]);
    if (useSpellName) {
      row.spellName = nameNew[id] ?? "";
    }
    return row;
  });
  const deleted = deletedIds.map((id) => {
    const row = normalizeRow(oldRows[id]);
    if (useSpellName) {
      row.spellName = nameOld[id] ?? "";
    }
    return row;
  });

  const modified = [];
  for (const id of commonIds) {
    const beforeRaw = normalizeRow(oldRows[id]);
    const afterRaw = normalizeRow(newRows[id]);
    const changes = [];
    if (useSpellName) {
      const beforeName = nameOld[id] ?? "";
      const afterName = nameNew[id] ?? "";
      beforeRaw.spellName = beforeName;
      afterRaw.spellName = afterName;
      if (beforeName !== afterName) {
        changes.push({
          field: "spellName",
          oldValue: beforeName,
          newValue: afterName,
        });
      }
    }
    for (const f of fields) {
      const oldVal = beforeRaw[f] ?? "";
      const newVal = afterRaw[f] ?? "";
      if (oldVal !== newVal) {
        changes.push({
          field: f,
          oldValue: oldVal,
          newValue: newVal,
        });
      }
    }
    if (changes.length > 0) {
      const spellId = beforeRaw.ID ?? id;
      modified.push({
        spellId,
        before: beforeRaw,
        after: afterRaw,
        fieldChanges: changes,
      });
    }
  }

  return { added, modified, deleted };
}

function sortId(a, b) {
  const na = /^\d+$/.test(a) ? Number(a) : a;
  const nb = /^\d+$/.test(b) ? Number(b) : b;
  if (typeof na === "number" && typeof nb === "number") return na - nb;
  return String(na).localeCompare(String(nb));
}

function main() {
  const args = process.argv.slice(2);
  const oldPath = getArg(args, "--old");
  const newPath = getArg(args, "--new");
  const outPathArg = getArg(args, "--out");
  const locale = getArg(args, "--locale", "zhCN");
  const encoding = getArg(args, "--encoding", "utf8");
  const spellNameOldArg = getArg(args, "--spellname-old");
  const spellNameNewArg = getArg(args, "--spellname-new");

  if (!oldPath || !newPath) {
    console.error("Usage: node scripts/diff_spell.js --old <old.csv> --new <new.csv> [--out file.json] [--locale zhCN] [--spellname-old file.csv] [--spellname-new file.csv]");
    process.exit(1);
  }

  const oldData = readCsv(oldPath, encoding);
  const newData = readCsv(newPath, encoding);

  if (oldData.header.join(",") !== newData.header.join(",")) {
    console.warn("Warning: CSV headers differ between files.");
  }

  const fromVersion = parseVersion(oldPath) || "unknown";
  const toVersion = parseVersion(newPath) || "unknown";
  const oldDir = path.dirname(oldPath);
  const newDir = path.dirname(newPath);
  const spellNameOldPath = spellNameOldArg || (fromVersion !== "unknown" ? path.join(oldDir, `SpellName.${fromVersion}.csv`) : null);
  const spellNameNewPath = spellNameNewArg || (toVersion !== "unknown" ? path.join(newDir, `SpellName.${toVersion}.csv`) : null);
  const spellNameOld = buildSpellNameMap(spellNameOldPath, encoding);
  const spellNameNew = buildSpellNameMap(spellNameNewPath, encoding);
  const useSpellName = Boolean(spellNameOld.path || spellNameNew.path);

  const header = newData.header.length ? newData.header : oldData.header;
  const { added, modified, deleted } = buildDiff(
    oldData.rows,
    newData.rows,
    header,
    spellNameOld.map,
    spellNameNew.map,
    useSpellName
  );
  const outPath = outPathArg || `spellparse_${fromVersion}_to_${toVersion}.${locale}.json`;

  const columns = useSpellName ? [...header, "spellName"] : header;
  const out = {
    table: "Spell",
    fromVersion,
    toVersion,
    locale,
    key: "ID",
    columns,
    summary: {
      added: added.length,
      modified: modified.length,
      deleted: deleted.length,
      total: Object.keys(newData.rows).length,
    },
    details: {
      added,
      modified,
      deleted,
    },
    duplicates: {
      old: oldData.duplicates,
      new: newData.duplicates,
      spellNameOld: spellNameOld.duplicates,
      spellNameNew: spellNameNew.duplicates,
    },
    sources: {
      spellNameOld: spellNameOld.path,
      spellNameNew: spellNameNew.path,
    },
  };

  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
  console.log(`Wrote: ${outPath}`);
  console.log(`Summary: +${added.length} ~${modified.length} -${deleted.length} (total ${Object.keys(newData.rows).length})`);
}

main();
