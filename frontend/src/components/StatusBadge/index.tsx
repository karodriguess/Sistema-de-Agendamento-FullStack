type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusMap: Record<string, { label: string; className: string }> = {
    confirmado: {
      label: "Confirmado",
      className: "bg-green-100 text-green-700",
    },

    agendado: {
      label: "Agendado",
      className: "bg-blue-100 text-blue-700",
    },

    cancelado_cliente: {
      label: "Cancelado pelo cliente",
      className: "bg-red-100 text-red-700",
    },

    cancelado: {
      label: "Cancelado",
      className: "bg-red-100 text-red-700",
    },

    remarcado_cliente: {
      label: "Remarcado pelo cliente",
      className: "bg-amber-100 text-amber-700",
    },

    concluido: {
      label: "Concluído",
      className: "bg-slate-100 text-slate-700",
    },
  };

  const current = statusMap[status] || {
    label: status,
    className: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}
