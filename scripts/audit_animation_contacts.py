"""Run in Blender: sample both actions for hand/environment intersections."""
import bpy, json
from mathutils.bvhtree import BVHTree
s=bpy.context.scene; r=bpy.data.objects['Armature']; ad=r.animation_data
old_action=ad.action; old_frame=s.frame_current
body=bpy.data.objects['Cylinder.003']
hand_ids=set()
for v in body.data.vertices:
    if sum(g.weight for g in v.groups if 'Hand' in body.vertex_groups[g.group].name)>0.5:
        hand_ids.add(v.index)
hand_faces=[tuple(p.vertices) for p in body.data.polygons if all(i in hand_ids for i in p.vertices)]
def tree(o,faces=None):
    e=o.evaluated_get(bpy.context.evaluated_depsgraph_get());m=e.to_mesh()
    result=BVHTree.FromPolygons([e.matrix_world@v.co for v in m.vertices],faces if faces is not None else [tuple(p.vertices) for p in m.polygons])
    e.to_mesh_clear();return result
report={}
try:
 for name in ['wave','typing']:
    ad.action=bpy.data.actions[name];ad.action_slot=ad.action.slots[0]
    hits={}
    for f in range(1,int(ad.action.frame_range[1])+1):
        s.frame_set(f);bpy.context.view_layer.update();h=tree(body,hand_faces)
        for name2 in ['White desk top','Keyboard base','Cube.001','Polo','Chair armrest','Chair armrest.001']+[o.name for o in s.objects if o.name.startswith('Keyboard key')]:
            count=len(h.overlap(tree(bpy.data.objects[name2])))
            if count:hits.setdefault(name2,[]).append([f,count])
    report[name]=hits
finally:
 ad.action=old_action;ad.action_slot=old_action.slots[0];s.frame_set(old_frame)
path='/home/kis/portfolio/dat-portfolio/artifacts/animation-contact-audit.json'
open(path,'w').write(json.dumps(report,indent=2));print(json.dumps(report))
