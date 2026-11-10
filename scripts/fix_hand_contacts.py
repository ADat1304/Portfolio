"""Bake two-bone arm corrections without stretching limbs or changing finger motion."""
import bpy, math
from mathutils import Vector, Matrix
from pathlib import Path
root=Path('/home/kis/portfolio/dat-portfolio')
s=bpy.context.scene;r=bpy.data.objects['Armature'];ad=r.animation_data
backup=root/'src/model/clay_workspace_before_contact_fix.blend'
if not backup.exists():bpy.ops.wm.save_as_mainfile(filepath=str(backup),copy=True)
old_frame=s.frame_current;old_name=ad.action.name
for clip in ['wave','typing']:
 source=bpy.data.actions.get(clip+'_before_contact_fix')
 if source is None:
  source=bpy.data.actions[clip];source.name=clip+'_before_contact_fix';source.use_fake_user=True
 previous=bpy.data.actions.get(clip)
 if previous:previous.name=clip+'_superseded_contact_fix'
 corrected=source.copy();corrected.name=clip;corrected.use_fake_user=True
 samples=[]
 ad.action=source;ad.action_slot=source.slots[0]
 for frame in range(1,int(source.frame_range[1])+1):
  s.frame_set(frame);bpy.context.view_layer.update()
  samples.append({side:[r.pose.bones['mixamorig:'+side+part].matrix.copy() for part in ['Arm','ForeArm','Hand']] for side in ['Left','Right']})
 ad.action=corrected;ad.action_slot=corrected.slots[0]
 for frame,poses in enumerate(samples,1):
  s.frame_set(frame);bpy.context.view_layer.update()
  for side,matrices in poses.items():
   a,b,h=[r.pose.bones['mixamorig:'+side+p] for p in ['Arm','ForeArm','Hand']]
   shoulder,elbow,wrist=[m.translation.copy() for m in matrices]
   # Raise the hand path in world space. Preserve the original elbow bend plane.
   lift=0.035
   if clip=='wave':
    def ease(t):
     t=max(0,min(1,t));return t*t*(3-2*t)
    lift=0.04+0.06*ease((frame-72)/24)-0.065*ease((frame-128)/21)
   offset=r.matrix_world.inverted().to_3x3()@Vector((0,0,lift))
   target=wrist+offset
   upper=(elbow-shoulder).length;lower=(wrist-elbow).length
   axis=target-shoulder;distance=min(axis.length,upper+lower-0.0001);axis.normalize()
   target=shoulder+axis*distance
   pole=elbow-shoulder;pole-=axis*pole.dot(axis);pole.normalize()
   along=(upper*upper-lower*lower+distance*distance)/(2*distance)
   bend=math.sqrt(max(0,upper*upper-along*along))
   new_elbow=shoulder+axis*along+pole*bend
   for bone,old,start,end,old_end in [(a,matrices[0],shoulder,new_elbow,elbow),(b,matrices[1],new_elbow,target,wrist)]:
    old_start=old.translation
    rotation=(old_end-old_start).rotation_difference(end-start).to_matrix().to_4x4()
    bone.matrix=Matrix.Translation(start)@rotation@Matrix.Translation(-old_start)@old
    bpy.context.view_layer.update()
   hand_matrix=matrices[2].copy();hand_matrix.translation=target;h.matrix=hand_matrix
   bpy.context.view_layer.update()
   for bone in [a,b,h]:
    bone.keyframe_insert('location',frame=frame,group=bone.name)
    bone.keyframe_insert('rotation_quaternion',frame=frame,group=bone.name)
    bone.keyframe_insert('scale',frame=frame,group=bone.name)
 ad.action=corrected
ad.action=bpy.data.actions[old_name] if old_name in ['wave','typing'] else bpy.data.actions['typing'];ad.action_slot=ad.action.slots[0];s.frame_set(old_frame)
print('Baked corrected wave and typing; original clips retained for rollback.')
