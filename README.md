# Deki Portfolio — Vue 3 + Three.js

## Chạy dự án

```sh
npm install
npm run dev
npm run build
```

## Tài nguyên đang dùng

- `public/models/workspace-animated.glb`: phòng làm việc và nhân vật, hai animation `wave` / `typing`.
- `public/models/deki.glb`: nhân vật ở phần giới thiệu và liên hệ.
- `public/draco/`: bộ giải mã model, cần giữ khi build/deploy.
- `src/model/`: file Blender, FBX và OBJ nguồn để tiếp tục chỉnh sửa; không phải tài nguyên tải trên web.

## Chỉnh sửa và xuất model

Mở `src/model/clay_workspace_animated.blend` trong Blender, chạy `scripts/export_animated_workspace.py`, sau đó chạy `python scripts/finalize_workspace_glb.py` để chỉ giữ hai clip phát trên web và cập nhật manifest.

`scripts/export_models.py` xuất riêng `deki.glb` từ file Blender nhân vật. Script này không dùng cho model có animation.

Các script trong `scripts/` phục vụ chỉnh rig, màu, xuất model và kiểm tra. Một số script dựng cảnh/căn chỉnh là thao tác một lần; không chạy lại trên scene đã hoàn thiện. Xem [hướng dẫn animation](animation-reference/WEB_ANIMATION.md).

`dist/`, `.vite-cache/`, `artifacts/`, ảnh/báo cáo tọa độ animation và các bản sao `.blend1` là dữ liệu sinh ra, có thể dọn khi cần. `npm run build` sẽ tạo lại `dist/`.

[THREE-NOTES.md](THREE-NOTES.md) và báo cáo phân tích lưu thiết kế ban đầu; hướng dẫn ở README này phản ánh cấu trúc hiện tại.
