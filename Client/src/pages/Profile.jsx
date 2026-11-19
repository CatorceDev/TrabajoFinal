import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { getComprador, updateMyProfile } from "../services/comprador.js";
import "../styles/profile.css";

const emptyProfile = {
    name: "",
    firstLastName: "",
    secondLastName: "",
    email: "",
    address: "",
};

function Profile() {
    const session = useOutletContext();
    const sessionUser = session?.comprador || session;
    const navigate = useNavigate();
    const [profile, setProfile] = useState(emptyProfile);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadProfile() {
            try {
                const data = await getComprador(sessionUser.id);
                if (isMounted) {
                    setProfile({
                        name: data.comprador.name || "",
                        firstLastName: data.comprador.firstLastName || "",
                        secondLastName: data.comprador.secondLastName || "",
                        email: data.comprador.email || "",
                        address: data.comprador.address || "",
                    });
                }
            } catch (loadError) {
                if (isMounted) setError(loadError.message || "No se pudo cargar el perfil");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadProfile();
        return () => {
            isMounted = false;
        };
    }, [sessionUser.id]);

    function handleChange(event) {
        setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
        setError("");
        setSuccess("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword && !currentPassword) {
            setError("Ingresa tu contraseña actual para cambiarla.");
            return;
        }
        if (currentPassword && !newPassword) {
            setError("Ingresa la nueva contraseña que deseas utilizar.");
            return;
        }

        setSaving(true);
        try {
            const data = await updateMyProfile({
                ...profile,
                currentPassword,
                newPassword,
            });
            const updated = data.comprador;
            setProfile({
                name: updated.name || "",
                firstLastName: updated.firstLastName || "",
                secondLastName: updated.secondLastName || "",
                email: updated.email || "",
                address: updated.address || "",
            });
            setCurrentPassword("");
            setNewPassword("");
            setSuccess(data.message || "Perfil actualizado correctamente.");
        } catch (saveError) {
            setError(saveError.message || "No se pudo guardar el perfil.");
        } finally {
            setSaving(false);
        }
    }

    function logout() {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    }

    const displayName = [profile.name || sessionUser.name, profile.firstLastName || sessionUser.firstLastName]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="profile-page">
            <header className="profile-header">
                <Link className="profile-brand" to="/" aria-label="Volver al inicio">
                    <span className="profile-brand-mark">LV</span>
                    <span><strong>Lonja de Veracruz</strong><small>Cuenta de usuario</small></span>
                </Link>
                <div className="profile-header-actions">
                    <span className="profile-header-name">{displayName || "Mi cuenta"}</span>
                    <button className="profile-logout" type="button" onClick={logout}>Cerrar sesión</button>
                </div>
            </header>

            <main className="profile-main">
                <Link className="profile-back-link" to="/">← Volver al panel</Link>
                <section className="profile-card" aria-labelledby="profile-title">
                    <div className="profile-heading">
                        <span className="profile-eyebrow">MI CUENTA</span>
                        <h1 id="profile-title">Editar perfil</h1>
                        <p>Actualiza tus datos de contacto y la información de acceso.</p>
                    </div>

                    {loading ? (
                        <p className="profile-feedback" role="status">Cargando tus datos…</p>
                    ) : (
                        <form className="profile-form" onSubmit={handleSubmit}>
                            <div className="profile-fields">
                                <label>
                                    Nombre
                                    <input name="name" autoComplete="given-name" maxLength={15} required value={profile.name} onChange={handleChange} />
                                </label>
                                <label>
                                    Primer apellido
                                    <input name="firstLastName" autoComplete="family-name" maxLength={15} required value={profile.firstLastName} onChange={handleChange} />
                                </label>
                                <label>
                                    Segundo apellido
                                    <input name="secondLastName" autoComplete="additional-name" maxLength={15} value={profile.secondLastName} onChange={handleChange} />
                                </label>
                                <label>
                                    Correo electrónico
                                    <input name="email" type="email" autoComplete="email" maxLength={80} required value={profile.email} onChange={handleChange} />
                                </label>
                                <label className="profile-address-field">
                                    Dirección
                                    <input name="address" autoComplete="street-address" maxLength={200} required value={profile.address} onChange={handleChange} />
                                </label>
                            </div>

                            <div className="profile-password-section">
                                <h2>Cambiar contraseña</h2>
                                <p>Deja estos campos vacíos si no deseas cambiarla.</p>
                                <div className="profile-fields">
                                    <label>
                                        Contraseña actual
                                        <input type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
                                    </label>
                                    <label>
                                        Nueva contraseña
                                        <input type="password" autoComplete="new-password" minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                                    </label>
                                </div>
                            </div>

                            {error && <p className="profile-message profile-error" role="alert">{error}</p>}
                            {success && <p className="profile-message profile-success" role="status">{success}</p>}

                            <div className="profile-actions">
                                <button className="profile-cancel" type="button" onClick={() => navigate("/")}>Cancelar</button>
                                <button className="profile-save" type="submit" disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</button>
                            </div>
                        </form>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Profile;
