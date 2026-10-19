import { Saludo } from "./Saludo.tsx";
import { TarjetaPerfil } from "./TarjetaPerfil.tsx";

export default function App() {
  return (
    <main className="pagina">
      <Saludo nombre="Dana" />

      <section className="equipo">
        <TarjetaPerfil nombre="Leonel Carballo" carrera="Ingeniería en Software" semestre={7} />
        <TarjetaPerfil nombre="Andrea Melendrez" carrera="Ingeniería en Software" semestre={7} />
        <TarjetaPerfil nombre="Angel Servin" carrera="Ingeniería en Software" semestre={7} />
      </section>
    </main>
  );
}