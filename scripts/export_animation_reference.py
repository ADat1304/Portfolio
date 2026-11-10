"""Run inside Blender to save world-space animation references for room assembly."""
import bpy, csv, json, math
from pathlib import Path
from mathutils import Matrix

out = Path('/home/kis/portfolio/dat-portfolio/animation-reference')
scene = bpy.context.scene
rig = bpy.data.objects['Armature']
ad = rig.animation_data
old_action, old_slot, old_frame = ad.action, ad.action_slot, scene.frame_current
collection = bpy.data.collections.get('DEKI_ROOM_TRANSFER')
if collection is None:
    collection = bpy.data.collections.new('DEKI_ROOM_TRANSFER')
    scene.collection.children.link(collection)
for obj in [rig, *rig.children_recursive]:
    if obj.name not in collection.objects:
        collection.objects.link(obj)

refs = {
    'REF_ChairPivot': None,
    'REF_Hips': 'mixamorig:Hips',
    'REF_RightHand': 'mixamorig:RightHand',
    'REF_LeftHand': 'mixamorig:LeftHand',
    'REF_RightIndex': 'mixamorig:RightHandIndex3',
    'REF_LeftIndex': 'mixamorig:LeftHandIndex3',
    'REF_RightFoot': 'mixamorig:RightFoot',
    'REF_LeftFoot': 'mixamorig:LeftFoot',
}
for name, bone in refs.items():
    obj = bpy.data.objects.get(name)
    if obj is None:
        obj = bpy.data.objects.new(name, None)
        collection.objects.link(obj)
    obj.empty_display_type = 'ARROWS'
    obj.empty_display_size = 0.12 if bone is None else 0.06
    obj.hide_render = True
    for constraint in list(obj.constraints):
        obj.constraints.remove(constraint)
    if bone:
        c = obj.constraints.new('COPY_TRANSFORMS'); c.target = rig; c.subtarget = bone
        obj['meaning'] = 'Bone origin reference; not a calibrated prop contact point.'
    else:
        c = obj.constraints.new('COPY_LOCATION'); c.target = rig
        c = obj.constraints.new('COPY_ROTATION'); c.target = rig
        c.use_x = False; c.use_y = False; c.use_z = True
        obj['meaning'] = 'Ground pivot at model origin; use world Z yaw for chair swivel. Seat height must be fitted to chair mesh.'

fps = scene.render.fps / scene.render.fps_base
result = {'coordinate_space':'Blender world', 'units':'meters', 'up_axis':'+Z',
          'character_forward_at_zero_yaw':'-Y', 'fps':fps,
          'rig_scale':list(rig.scale), 'notes':[
              'Actions are independent; each starts at frame 1.',
              'Chair pivot is the rig origin projected in the current scene, not a measured chair seat.',
              'Hand references are bone origins, not mouse or keyboard surface contacts.',
              'Typing includes mouse use near frames 1-60 and 225-295; room props must be fitted to this hand trajectory.'], 'clips':{}}
rows = []
for action_name in ['wave', 'typing']:
    action = bpy.data.actions[action_name]
    ad.action = action; ad.action_slot = action.slots[0]
    frames = []
    for frame in range(int(action.frame_range[0]), int(action.frame_range[1])+1):
        scene.frame_set(frame)
        depsgraph = bpy.context.evaluated_depsgraph_get()
        evaluated = rig.evaluated_get(depsgraph)
        matrices = {'Model': evaluated.matrix_world.copy()}
        for name, bone in refs.items():
            if bone:
                matrices[name] = evaluated.matrix_world @ evaluated.pose.bones[bone].matrix
            else:
                matrices[name] = Matrix.Translation(evaluated.matrix_world.translation) @ Matrix.Rotation(evaluated.rotation_euler.z,4,'Z')
        entry = {'frame':frame, 'time_seconds':(frame-1)/fps,
                 'chair_yaw_degrees':math.degrees(evaluated.rotation_euler.z), 'anchors':{}}
        for name, matrix in matrices.items():
            loc, rot, scale = matrix.decompose()
            entry['anchors'][name] = {'position':list(loc),'quaternion_wxyz':list(rot),
                                      'scale':list(scale),'matrix_world_rows':[list(row) for row in matrix]}
            rows.append([action_name,frame,(frame-1)/fps,name,*loc,*rot,entry['chair_yaw_degrees']])
        frames.append(entry)
    result['clips'][action_name] = {'frame_start':frames[0]['frame'],'frame_end':frames[-1]['frame'],'frames':frames}
(out/'deki_animation_coordinates.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
with (out/'deki_animation_coordinates.csv').open('w',newline='') as f:
    w=csv.writer(f);w.writerow(['action','frame','time_seconds','anchor','x_m','y_m','z_m','qw','qx','qy','qz','chair_yaw_deg']);w.writerows(rows)
lines = ['# Tọa độ animation Deki', '',
'Đơn vị: mét. Trục đứng: +Z. Chính diện nhân vật ở góc xoay 0°: hướng −Y. Tốc độ: 24 fps.',
'`wave` (1–156) và `typing` (1–396) là hai Action độc lập, cùng bắt đầu từ frame 1.', '',
'## Mốc chính', '', '| Action | Frame | Góc ghế Z | Tâm hông XYZ (m) | Tay phải XYZ (m) | Tay trái XYZ (m) |',
'|---|---:|---:|---|---|---|']
for name, checkpoints in [('wave',[1,36,78,99,120,149,156]),('typing',[1,40,100,200,396])]:
    for frame in checkpoints:
        e=result['clips'][name]['frames'][frame-1]
        fmt=lambda anchor: ', '.join(f'{v:.4f}' for v in e['anchors'][anchor]['position'])
        lines.append(f"| {name} | {frame} | {e['chair_yaw_degrees']:.2f}° | {fmt('REF_Hips')} | {fmt('REF_RightHand')} | {fmt('REF_LeftHand')} |")
lines += ['', '## Mang sang file phòng', '',
'1. File → Append → chọn `deki_greeting_sequence.blend` → Collection → `DEKI_ROOM_TRANSFER`. Collection này chứa model và các Empty tham chiếu.',
'2. Các Empty tự bám rig khi đổi Action. Giữ nguyên scale rig (1.2321614); không Apply Transform riêng model khi đang căn animation.',
'3. Để dời cả cụm trong phòng, tạo một Empty làm gốc chung, rồi parent model, ghế và bàn vào đó bằng Keep Transform. Không parent các Empty tham chiếu vào gốc mới: chúng đã theo rig qua constraint.',
'4. Tâm xoay ghế tham chiếu là `REF_ChairPivot`, hiện ở (0, 0, 0). Phần ghế xoay cần dùng góc Z của điểm này; không sao chép góc X 90° hoặc scale của Armature. Chân đế ghế có thể giữ đứng yên.',
'5. `REF_Hips` là tâm xương hông, KHÔNG phải mặt ghế. Căn cao độ đệm theo bề mặt model và hình học ghế thực tế.',
'6. `REF_RightHand`, `REF_LeftHand` là gốc xương bàn tay; `REF_RightIndex`, `REF_LeftIndex` là gốc đốt cuối ngón trỏ. Dùng để căn bàn phím và vùng thao tác.',
'7. Clip `typing` có các đoạn dùng chuột; cần căn mesh theo quỹ đạo tay. Khi có mesh chuột, căn vị trí dưới lòng bàn tay ở frame tiếp xúc rồi lưu offset; chỉ bật bám tay trong đoạn cầm chuột, tránh để chuột đi theo toàn bộ đoạn vẫy/gõ.',
'', '## Dữ liệu', '',
'JSON lưu matrix world, vị trí, quaternion WXYZ và scale mỗi frame. CSV dùng để tra cứu nhanh. Tọa độ trong hai file là tọa độ scene gốc; sau khi bố trí trong phòng, dùng các Empty để lấy tọa độ mới.',
'`wave`: giữ 135° đến frame 78, quay về 0° ở frame 120. `typing`: góc Z luôn 0°.',
'Khi chọn `typing`, đặt timeline 1–396; với `wave`, đặt 1–156.']
(out/'README.md').write_text('\n'.join(lines)+'\n')
textblock = bpy.data.texts.get('DEKI_ANIMATION_REFERENCE.md') or bpy.data.texts.new('DEKI_ANIMATION_REFERENCE.md')
textblock.clear();textblock.write('\n'.join(lines))
ad.action = old_action
if old_action: ad.action_slot = old_slot
scene.frame_set(old_frame)
bpy.ops.wm.save_as_mainfile(filepath='/home/kis/portfolio/dat-portfolio/src/model/deki_greeting_sequence.blend')
print('Exported',len(rows),'anchor samples. Collection:',collection.name)
print('\n'.join(lines[6:21]))
