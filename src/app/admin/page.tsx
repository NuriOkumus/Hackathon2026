import AdminPanel from "./AdminPanel";

export const metadata = {
  title: "Admin | VBT Hackathon 2026",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div style={{ position: "relative", zIndex: 200, minHeight: "100vh" }}>
      <AdminPanel />
    </div>
  );
}
