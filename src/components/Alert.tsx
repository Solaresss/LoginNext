export type AlertState = { type: "ok" | "error"; text: string } | null;

export default function Alert({ alert }: { alert: AlertState }) {
  if (!alert) return null;
  return (
    <div className={`alert ${alert.type}`} role={alert.type === "error" ? "alert" : "status"}>
      {alert.text}
    </div>
  );
}
