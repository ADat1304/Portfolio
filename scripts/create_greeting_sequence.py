"""Build a seated greeting from the active Mixamo preparation action in Blender."""
import bpy
import math
from mathutils import Vector, Matrix, Quaternion

scene = bpy.context.scene
rig = bpy.data.objects['Armature']
source = bpy.data.actions.get('mixamo.com') or rig.animation_data.action
rig.animation_data.action = source
rig.rotation_euler.z = 0.0
source.use_fake_user = True
samples = {}
for frame in range(1, 30):
    scene.frame_set(frame)
    samples[frame] = {b.name: b.matrix_basis.copy() for b in rig.pose.bones}
base = samples[1]
rig.animation_data.action = None
original_rotation = rig.rotation_euler.copy()

def restore(pose):
    for bone in rig.pose.bones:
        bone.matrix_basis = pose[bone.name]
    bpy.context.view_layer.update()

def aim(name, direction):
    bone = rig.pose.bones['mixamorig:' + name]
    local_direction = rig.matrix_world.to_3x3().inverted() @ Vector(direction)
    delta = (bone.tail - bone.head).rotation_difference(local_direction)
    matrix = bone.matrix.copy()
    bone.matrix = Matrix.Translation(matrix.translation) @ delta.to_matrix().to_4x4() @ Matrix.Translation(-matrix.translation) @ matrix
    bpy.context.view_layer.update()

restore(base)
aim('RightArm', (-0.36, -0.06, 0.03))
aim('RightForeArm', (-0.10, -0.02, 0.38))
aim('RightHand', (-0.04, 0.0, 0.30))
for bone in rig.pose.bones:
    if bone.name.startswith('mixamorig:RightHand') and bone.name != 'mixamorig:RightHand':
        bone.rotation_mode = 'QUATERNION'
        bone.rotation_quaternion.identity()
# Turn the palm toward the character's forward direction, not edge-on.
hand = rig.pose.bones['mixamorig:RightHand']
hand.rotation_mode = 'QUATERNION'
hand.rotation_quaternion = hand.rotation_quaternion @ Quaternion((0, 1, 0), math.radians(90))
bpy.context.view_layer.update()
wave = {b.name: b.matrix_basis.copy() for b in rig.pose.bones}

def ease(t):
    t = max(0.0, min(1.0, t))
    return t*t*(3-2*t)

previous = bpy.data.actions.get('Greeting_Wave_Turn135_PrepareTyping')
if previous:
    previous.name = 'Greeting_Before_WaveAngle_Adjustment'
    previous.use_fake_user = True
action = bpy.data.actions.new('Greeting_Wave_Turn135_PrepareTyping')
rig.animation_data.action = action
rig.rotation_mode = 'XYZ'
for frame in range(1, 157):
    scene.frame_set(frame)
    if frame <= 78:
        amount = ease((frame-1)/16) * (1-ease((frame-60)/18))
        for bone in rig.pose.bones:
            l0,q0,s0 = base[bone.name].decompose()
            l1,q1,s1 = wave[bone.name].decompose()
            bone.rotation_mode = 'QUATERNION'
            bone.location = l0.lerp(l1, amount)
            bone.rotation_quaternion = q0.slerp(q1, amount)
            bone.scale = s0.lerp(s1, amount)
        hand = rig.pose.bones['mixamorig:RightHand']
        from mathutils import Quaternion
        hand.rotation_quaternion = hand.rotation_quaternion @ Quaternion((0,0,1), math.radians(12)*math.sin((frame-16)*math.tau/18)*amount)
    elif frame <= 120:
        restore(base)
    else:
        restore(samples[min(29, frame-120)])
    rig.rotation_euler = original_rotation
    rig.rotation_euler.z = original_rotation.z + math.radians(135)*(1-ease((frame-78)/42))
    rig.keyframe_insert('rotation_euler', frame=frame)
    for bone in rig.pose.bones:
        bone.keyframe_insert('location', frame=frame, group=bone.name)
        bone.keyframe_insert('rotation_quaternion', frame=frame, group=bone.name)
        bone.keyframe_insert('scale', frame=frame, group=bone.name)
scene.frame_start = 1
scene.frame_end = 156
scene.render.fps = 24
for name, frame in [('Wave',1),('Turn 135 degrees',78),('Prepare typing',120),('Ready',149)]:
    marker = scene.timeline_markers.get(name) or scene.timeline_markers.new(name, frame=frame)
    marker.frame = frame
scene.frame_set(36)
bpy.ops.wm.save_as_mainfile(filepath='/home/kis/portfolio/dat-portfolio/src/model/deki_greeting_sequence.blend')
print('Saved greeting sequence: 156 frames, 24 fps; original action preserved:', source.name)
