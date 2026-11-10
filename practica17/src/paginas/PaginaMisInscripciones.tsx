import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { traerMisInscripciones } from '../servicios/gimnasio.ts';
import { mensajeDeError, urlImagen } from '../servicios/api.ts';
import { Cargando } from '../componentes/Cargando.tsx';
import { MensajeError } from '../componentes/MensajeError.tsx';
import type { Inscripcion } from '../tipos.ts';

export default function PaginaMisInscripciones() {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let vigente = true;
    traerMisInscripciones()
      .then((datos) => { if (vigente) setInscripciones(datos); })
      .catch((e) => { if (vigente) setError(mensajeDeError(e, 'No se pudieron traer tus inscripciones.')); })
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, [intento]);

  function reintentar() {
    setCargando(true);
    setError(null);
    setIntento((n) => n + 1);
  }

  if (cargando) return <Cargando />;
  if (error) return <MensajeError mensaje={error} onReintentar={reintentar} />;

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