## Personal Blog (React + Vite) + Admin Dashboard + Supabase Auth

A full-stack personal blog application with a public blog (posts, categories, likes, comments) and an admin dashboard for managing articles and categories. Authentication is handled by **Supabase Auth**, and images are stored in **Supabase Storage**.

## Deployed Website

- **Frontend**: https://personal-blog-three-js.vercel.app
- **Backend API**: https://personal-blog-three-js-api.vercel.app

### Article Section
![article_section](https://vgsdcnyakswlnfnfcotx.supabase.co/storage/v1/object/public/photo-github/catkits/personal-blog-threejs/jpg_web_personalblog_1.jpg)

### Blog Card
![blog_card](https://vgsdcnyakswlnfnfcotx.supabase.co/storage/v1/object/public/photo-github/catkits/personal-blog-threejs/jpg_web_personalblog_2.jpg)

### Blog Detail
![blog_detail](https://vgsdcnyakswlnfnfcotx.supabase.co/storage/v1/object/public/photo-github/catkits/personal-blog-threejs/jpg_web_personalblog_2_5.jpg)

### Admin Panel
![admin](https://vgsdcnyakswlnfnfcotx.supabase.co/storage/v1/object/public/photo-github/catkits/personal-blog-threejs/jpg_web_personalblog_3.jpg)

##🌟 Features

### Public Blog

- **Browse posts** with pagination
- **Filter by category** and **search by keyword**
- **Blog detail page** with **Markdown rendering**
- **Comments** on posts (requires login)
- **Like / Unlike** posts (requires login)

### Authentication & Profile

- **Sign up / Log in** using Supabase Auth
- **Profile page**: update name/username/bio + **upload profile picture**
- **Reset password** (requires login)
- **Username/email availability check**

### Admin Dashboard (Role-based)

- **Admin-only routes** under `/admin`
- **Article management** (CRUD)
- **Draft / Published workflow**
  - `status_id = 1` → Draft
  - `status_id = 2` → Published
- **Category management** (CRUD)
- **Upload post thumbnail image** (Supabase Storage)

##🛠️ Tech Stack

### Frontend (client)

- **React 19** + **Vite**
- **React Router**
- **Tailwind CSS**
- **shadcn/ui** (Radix UI) + **Lucide icons**
- **Axios** (with JWT interceptor)
- **Markdown editor**: `@uiw/react-md-editor`
- **Markdown renderer**: `react-markdown` + `remark-gfm` + `rehype-raw`

### Backend (server)

- **Node.js** + **Express**
- **PostgreSQL**
- **Prisma ORM**
- **Supabase Auth** (JWT verification via `supabase.auth.getUser`)
- **Supabase Storage** (image upload/delete)
- **Multer** (upload to memory)