import { Link } from 'react-router';
import { urlImagen } from '../servicios/api.ts';
import { Cargando } from '../componentes/Cargando.tsx';
import { MensajeError } from '../componentes/MensajeError.tsx';
import { useInscripciones } from '../store/useInscripciones.ts';


export default function PaginaMisInscripciones() {
  const { inscripciones, cargando, error, cargar } = useInscripciones();

  if (cargando) return <Cargando />;
  if (error) return <MensajeError mensaje={error} onReintentar={cargar} />;

  return (
    <>
      <div className="pagina__encabezado">
        <h1>Mis inscripciones</h1>
      </div>

      {inscripciones.length === 0 ? (
        <section className="vacio">
          <h2>Todavía no tienes clases</h2>
          <Link to="/clases" className="boton">Ver las clases</Link>
        </section>
      ) : (
        <ul className="inscripciones">
          {inscripciones.map((i) => (
            <li key={i.id} className="inscripcion">
              <img className="inscripcion__imagen" src={urlImagen(i.clase.imagen)} alt="" />
              <div>
                <div className="inscripcion__clase">{i.clase.nombre}</div>
                <div className="inscripcion__meta">
                  {i.horario.dia} · {i.horario.horaInicio} · {i.horario.entrenador} · {i.estado}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}