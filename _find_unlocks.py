import sys
sys.stdout.reconfigure(encoding="utf-8")
p = r"C:\Users\13372\Desktop\mark\项目\水产管理\docker\mysql\init\00-full-schema.sql"
with open(p, encoding="utf-8") as f:
    lines = f.read().split("\n")
for i, line in enumerate(lines):
    if "UNLOCK TABLES" in line:
        for j in range(max(0,i-5), i):
            if "Dumping data for table" in lines[j]:
                t = lines[j].split("`")[1]
                tbl = t if len(t) > 3 else lines[j].split("table ")[1].split("`")[0].strip()
                print(f"L{i+1}: {tbl}")
                break