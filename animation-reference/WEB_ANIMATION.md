# Animation trong dat-portfolio

Cảnh workspace tải `public/models/workspace-animated.glb` (Draco), xuất từ `src/model/clay_workspace_animated.blend`. Giữ nguyên rig, skin weights và hai clip độc lập: `wave` 6,5 giây; `typing` 16,5 giây. Balo đã bỏ.

`src/three/workspace-animation.ts` quản lý một AnimationMixer cho toàn bộ cảnh:

- Khi cảnh xuất hiện: chạy `wave` một lần. Trước khi kết thúc 0,35 giây, chuyển mềm sang `typing` lặp lại.
- Các track xương `PROP_ChairSwivel`, `PROP_ChairBase`, `PROP_Mouse` có trong cả hai clip. Ghế tự chạy đồng bộ với người; không thêm tween xoay ghế chồng lên track đã bake.
- Bấm vào mô hình trong cảnh workspace để phát lại `wave`; bấm màn hình vẫn mở Projects.
- Cảnh ngoài viewport hoặc tab ẩn không tiến thời gian animation. Khi bật giảm chuyển động, giữ tư thế đầu của `typing`.
- Clone bằng SkeletonUtils để mỗi model dùng đúng skeleton.

Có thể điều khiển từ code giao diện:

```ts
window.dispatchEvent(new CustomEvent('deki:animation', { detail: 'wave' }));
window.dispatchEvent(new CustomEvent('deki:animation', { detail: 'typing' }));
```

## Chuột

Sau mỗi lần cập nhật mixer, MouseFollower đọc điểm giữa lòng bàn tay trên xương `mixamorigRightHand` (local offset `0, 0.065, 0`) và điều khiển `PROP_Mouse`. Vùng thao tác lấy từ mesh `Mouse_mat`, theo tọa độ local của toàn cảnh (glTF dùng +Y làm trục đứng). Chỉ bắt đầu bám khi tay gần chuột, thấp gần mặt bàn và nằm trong vùng lót chuột. Giữ độ cao cố định, giới hạn X/Z trong lót chuột, giữ offset lúc tiếp xúc để tránh nhảy vị trí. Khi tay rời vùng hoặc đang vẫy, chuột không đi theo.

Clip `typing` có thao tác chuột ở đầu clip (khoảng frame 1–60), khoảng frame 225–295 và cuối clip trước khi lặp. Các đoạn giữa là gõ phím. Chuột, lót chuột và bàn phím đã được căn lại theo quỹ đạo gốc; nguyên nhân chuột trước đây đứng yên là vị trí đặt quá xa tay. Dùng `scripts/calibrate_mouse_contact.py` một lần cho scene chưa căn; không chạy lặp trên scene đã có cờ `mouse_contact_calibrated`.

## Xuất lại model

Mở `clay_workspace_animated.blend` trong Blender, chạy `scripts/export_animated_workspace.py`. Script giữ nguyên animation và phục hồi action/frame/selection sau khi xuất. Sau đó chạy `python scripts/finalize_workspace_glb.py` để loại các clip backup khỏi GLB và cập nhật manifest. Không dùng exporter tĩnh `export_models.py` cho file này vì exporter đó làm mất rig và animation.

## Kiểm tra

- `npm run build`
- Chạy Vite và Chrome có remote debugging port 9222, rồi `PREVIEW_URL=http://127.0.0.1:5174/ node scripts/check-workspace-animation.mjs`.
- Script kiểm tra asset thực: ghế xoay, chân ghế đứng yên, chuột không chạy khi vẫy, chuyển clip, lặp typing, replay và reduced motion. Kiểm tra cả hai đoạn dùng chuột trong clip thực, đoạn chuột đứng yên khi gõ và tiếp xúc bằng chuyển động tay tổng hợp; xuất screenshot desktop/mobile vào `artifacts/`.
