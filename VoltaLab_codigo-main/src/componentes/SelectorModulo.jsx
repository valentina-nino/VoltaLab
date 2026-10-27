export const MODULOS = [["electricidad", "Electricidad"], ["calor", "Calor"], ["ondas", "Ondas"]];
export const moduloDeClave = (clave, buscar) => {
  if (!clave) return "electricidad";
  if (clave.startsWith("mod:")) return clave.slice(4);
  const l = buscar(clave); return l ? l.modulo : "electricidad";
};
export default function SelectorModulo({ modulo, set }) {
  return (
    <div className="fis-tabs sel-mod" role="tablist" aria-label="Módulo">
      {MODULOS.map(([id, t]) => <button key={id} role="tab" aria-selected={modulo === id} className={modulo === id ? "on" : ""} onClick={() => set(id)}>{t}</button>)}
    </div>
  );
}
