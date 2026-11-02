# Hệ thống 3D Deki

## Đối chiếu với portfolio-2025-main

- `src/sources.ts` của bản tham chiếu khai báo 4 GLB và 15 textures. Loader ở `src/utils/resources.ts` phát sự kiện progress/ready; bản tham chiếu chưa có nhánh xử lý lỗi tải.
- `src/three/core/renderer.ts` bật các object ẩn, tắt frustum culling, gọi `compile()` rồi phục hồi trạng thái. Hàm `compile()` là async nhưng `objects/index.ts` gọi mà không await; bản mới đợi `compileAsync()` hoàn tất trước khi đóng loader.
- Camera tham chiếu dùng waypoints, hướng nhìn và parallax theo chuột; scene About render thêm một scene vào render target. Bản mới giữ các nguyên lý này, căn góc nhìn theo bounding box của model Deki.
- 18 bộ shader của bản tham chiếu gắn với geometry, UV, tên mesh và animation riêng. Không thể gắn nguyên bộ face-spritesheet, room bake hoặc lab effects lên một model khác rồi có kết quả đúng.

## Đã triển khai

- `src/three/sources.ts`: 2 model thực xuất từ 2 file Blender được cung cấp, không sử dụng các model phòng/avatar của bản tham chiếu.
- `resources.ts`: tải song song, progress, truyền lỗi cho giao diện, Draco decoder nằm local trong `public/draco/`.
- `compile.ts`: lưu visibility/culling, bật toàn bộ để precompile, phục hồi bằng `finally`; loader đợi shader của các scene và composite pass.
- `materials.ts`: studio matcap sinh bằng canvas và giữ màu gốc của Blender; không dùng dynamic lights/shadow maps. Đây là matcap, **chưa phải lightmap bake/AO bake**.
- `experience.ts`: một renderer cho ba vùng DOM bằng viewport/scissor; chỉ render vùng đang xuất hiện, tạm ngừng khi tab ẩn, pixel ratio tối đa 1.75, render target hologram tối đa 1024 mỗi chiều.
- Hero: góc phòng gần isometric, camera 32°, nhìn từ hướng tương ứng camera gốc Blender, parallax và thay đổi góc nhẹ theo cuộn.
- About: Deki clay hoặc shader hologram (Fresnel, scanlines, light sweep). Hologram render vào `WebGLRenderTarget` rồi composite trong suốt lên scene grid.
- Contact: dùng lại geometry Deki, chuyển động nhẹ và phản hồi khi nhấn nhân vật. Không tải model thứ ba.
- Raycast màn hình mở phần dự án; nhấn nhân vật hiện lời chào. Có link HTML tương ứng để sử dụng bằng bàn phím.
- Shader GLSL nằm riêng trong `src/three/shaders/`, import bằng Vite `?raw`.
- Loader có nút xem nội dung trước; khi WebGL/tải model thất bại, nội dung vẫn đọc được. Hỗ trợ reduced motion và dọn renderer, GPU resources, event listeners khi unmount.

## Tài nguyên và giới hạn

`public/models/manifest.json` ghi nguồn, dung lượng và số đỉnh sau xuất. GLB nén Draco: workspace khoảng 2.04 MB; Deki khoảng 0.59 MB. Nén giảm dung lượng tải, không giảm số tam giác GPU phải vẽ.

Model Deki cung cấp là mesh tĩnh, tư thế dang tay; chưa có rig/clip biểu cảm hoặc tư thế ngủ được author riêng. Vì vậy bản này không giả lập các animation facial spritesheet, ngủ/ngáy hoặc phòng lab không có trong tài nguyên. Muốn thêm các cảnh đó cần rig/pose và asset tương ứng. Texture bake cũ không dùng lại vì UV không tương thích.

Các phần học vấn, timeline, dự án, thông tin liên hệ và form cũ được giữ nguyên; cần kiểm tra lại dữ liệu mẫu, URL dự án/CV và cơ chế gửi form trước khi phát hành công khai.

## Chạy và xuất lại

```powershell
cd D:\port\Portfolio
npm.cmd install
npm.cmd run dev
npm.cmd run build
```

Xuất lại GLB (không ghi đè hai file `.blend` nguồn):

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --python scripts/export_models.py
```

Script bỏ studio ground 200m và pedestal, giới hạn subdivision, áp dụng geometry rồi gom mesh theo nhóm tương tác. Matcap giữ màu vật liệu gốc; không xuất lights/cameras/animations. `scripts/inspect_models.py` tạo báo cáo cấu trúc model để đối chiếu.

## Kiểm tra

`npm.cmd run build` kiểm tra TypeScript và production bundle. `scripts/browser-check.mjs` dùng Chrome DevTools Protocol tại cổng 9222 với server local cổng 5173 để ghi ảnh desktop, hologram, clay, mobile và lỗi console vào `artifacts/`. Công cụ này chỉ dùng cho QA local, không được bundle vào site.
