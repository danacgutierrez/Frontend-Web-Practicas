import { Link, useParams, useNavigate } from 'react-router';
import { useClase } from '../hooks/useClase.ts';
import { Cargando } from '../componentes/Cargando.tsx';
import { MensajeError } from '../componentes/MensajeError.tsx';
import { useState } from 'react';
import { useSesion } from '../sesion/SesionContext.tsx';
import { inscribirse } from '../servicios/gimnasio.ts';
import { mensajeDeError, urlImagen } from '../servicios/api.ts';
import { useInscripciones } from '../store/useInscripciones.ts';


export default function PaginaClase() {

    const { id } = useParams();

    const { clase, cargando, error, reintentar } = useClase(Number(id));

    const navegar = useNavigate();

    const { usuario } = useSesion();
    const [aviso, setAviso] = useState<string | null>(null);
    const [errorInscripcion, setErrorInscripcion] = useState<string | null>(null);

    const inscripciones = useInscripciones((s) => s.inscripciones);
    const inscritos = new Set(
        inscripciones.filter((i) => i.estado === 'confirmada').map((i) => i.horario.id),
    );

    async function inscribirme(horarioId: number) {
        if (!usuario) {
            navegar('/entrar', { state: { desde: `/clases/${id}` } });
            return;
        }
        setAviso(null);
        setErrorInscripcion(null);
        try {
            await inscribirse(horarioId);
            await useInscripciones.getState().cargar();
            setAviso('¡Listo! Quedaste inscrito.');
            reintentar(); // vuelve a pedir la clase: los lugares quedan al día
        } catch (e) {
            setErrorInscripcion(mensajeDeError(e, 'No se pudo completar la inscripción.'));
        }
    }

    if (cargando) return <Cargando />;
    if (error || !clase) return <MensajeError mensaje={error ?? 'No existe la clase.'} onReintentar={reintentar} />;


    return (
        <>
            <Link to="/clases" className="detalle__volver">← Todas las clases</Link>

            <article className="detalle">
                <img className="detalle__imagen" src={urlImagen(clase.imagen)} alt={clase.nombre} />
                <div className="detalle__datos">
                    <span className={`etiqueta etiqueta--${clase.categoria}`}>{clase.categoria}</span>
                    <h1>{clase.nombre}</h1>
                    <p className="pagina__bajada">{clase.descripcion} · {clase.duracionMin} min</p>
                    {aviso && <p className="aviso aviso--exito">{aviso}</p>}
                    {errorInscripcion && <p className="aviso aviso--error">{errorInscripcion}</p>}
                    <h2>Horarios</h2>
                    <ul className="horarios">
                        {clase.horarios.map((h) => (
                            <li key={h.id} className="horario">
                                <div>
                                    <div className="horario__dia">{h.dia} · {h.horaInicio}</div>
                                    <div className="horario__meta">{h.entrenador} · {h.disponibles} de {h.cupoMaximo} lugares</div>
                                </div>
                                {h.disponibles === 0 ? (
                                    <span className="horario__lleno">Lleno</span>
                                ) : (
                                    <button className="boton boton--chico" onClick={() => inscribirme(h.id)}>Inscribirme</button>
                                )}
                                {inscritos.has(h.id) ? (
                                    <span className="horario__inscrito">Inscrito ✓</span>
                                ) : h.disponibles === 0 ? (
                                    <span className="horario__lleno">Lleno</span>
                                ) : (
                                    <button className="boton boton--chico" onClick={() => inscribirme(h.id)}>Inscribirme</button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </article>
        </>
    )
}




