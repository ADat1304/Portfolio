"""Keep only playback clips; authoring backups stay in the blend file."""
import json,struct
from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'public/models/workspace-animated.glb';b=p.read_bytes();n=struct.unpack_from('<I',b,12)[0];j=json.loads(b[20:20+n]);tail=b[20+n:]
j['animations']=[a for a in j['animations'] if a['name'] in {'wave','typing'}]
assert {a['name'] for a in j['animations']}=={'wave','typing'}
x=json.dumps(j,separators=(',',':')).encode();x+=b' '*(-len(x)%4)
p.write_bytes(struct.pack('<III',0x46546c67,2,20+len(x)+len(tail))+struct.pack('<II',len(x),0x4e4f534a)+x+tail)
manifest=root/'public/models/manifest.json';entries=json.loads(manifest.read_text())
for e in entries:
 if e['output']==p.name:e['bytes']=p.stat().st_size
manifest.write_text(json.dumps(entries,indent=2)+'\n')
print('Validated playback clips:',[a['name'] for a in j['animations']])
