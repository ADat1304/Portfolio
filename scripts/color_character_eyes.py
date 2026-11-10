"""Assign eye colors by the existing disconnected sclera/iris/pupil/glint geometry."""
import bpy
obj=bpy.data.objects['eyes_cover.001']
colors=[('Eye whites','#f2eadc'),('Brown iris','#775032'),('Pupil','#18120f'),('Eye highlight','#ffffff')]
obj.data.materials.clear()
for name,color in colors:
 m=bpy.data.materials.get('Deki reference / '+name) or bpy.data.materials.new('Deki reference / '+name)
 rgb=[]
 for i in [1,3,5]:
  x=int(color[i:i+2],16)/255;rgb.append(x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4)
 m.use_nodes=True;m.diffuse_color=(*rgb,1)
 bs=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED');bs.inputs['Base Color'].default_value=(*rgb,1)
 obj.data.materials.append(m)
adj=[[] for v in obj.data.vertices]
for e in obj.data.edges:
 a,b=e.vertices;adj[a].append(b);adj[b].append(a)
seen=set();assign={};counts=[0]*4
for v in obj.data.vertices:
 if v.index in seen:continue
 stack=[v.index];seen.add(v.index);ids=[]
 while stack:
  i=stack.pop();ids.append(i)
  for j in adj[i]:
   if j not in seen:seen.add(j);stack.append(j)
 width=max(obj.data.vertices[i].co.x for i in ids)-min(obj.data.vertices[i].co.x for i in ids)
 slot=0 if width>0.04 else 1 if width>0.02 else 2 if width>0.01 else 3
 counts[slot]+=1
 for i in ids:assign[i]=slot
for p in obj.data.polygons:p.material_index=assign[p.vertices[0]]
assert counts==[2,2,2,2],counts
print('Eyes: 2 whites, 2 brown irises, 2 pupils, 2 highlights.')
