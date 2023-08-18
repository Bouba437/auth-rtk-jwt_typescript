import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBInput } from 'mdb-react-ui-kit';
import { useLoginUserMutation, useRegisterUserMutation } from '../services/authApi';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../app/hooks';
import { setUser } from '../features/authSlice';

const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
}

const Auth = () => {

    const [formValue, setFormValue] = useState(initialState);
    const [showRegister, setShowRegister] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [loginUser, {data: loginData, isSuccess: isLoginSuccess, isError: isLoginError, error: loginError}] = useLoginUserMutation();
    const [registerUser, {data: registerData, isSuccess: isRegisterSuccess, isError: isRegisterError, error: registerError}] = useRegisterUserMutation();

    const { firstName, lastName, email, password, confirmPassword } = formValue;

    const handleChange = (e: any) => {
        setFormValue({...formValue, [e.target.name]: e.target.value})
    }; 

    const handleLogin = async () => {
        if(email && password) {
            await loginUser({ email, password })
        } else {
            toast.error("Veuillez remplir tous les champs..")
        }
    };

    const handleRegister = async () => {
        if(password !== confirmPassword) {
            return toast.error("Les mots de passe ne sont pas identiques..")
        }
        if(firstName && lastName && email && password) {
            await registerUser({firstName, lastName, email, password})
        }
    }

    useEffect(() => {
        if(isLoginSuccess) {
            toast.success("Vous êtes connecté avec succès");
            dispatch(setUser({name: loginData.result.name, token: loginData.token}))
            navigate("/dashboard");
        }

        if(isRegisterSuccess) {
            toast.success("Vous êtes inscrit avec succès");
            dispatch(setUser({name: registerData.result.name, token: registerData.token}))
            navigate("/dashboard");
        }
    }, [isLoginSuccess, isRegisterSuccess]);

    useEffect(() => {
        if(isLoginError) {
            toast.error((loginError as any).data.message)
        }

        if(isRegisterError) {
            toast.error((registerError as any).data.message)
        }
    }, [isLoginError, isRegisterError])

    return (
        <section className='vh-100 gradient-custom'>
            <div className="container py-4 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card bg-dark text-white" style={{borderRadius: "1rem"}}>
                            <div className="card-body p-4 text-center">
                                <div className="mb-md-5 mt-md-4 pb-5">
                                    <h2 className="fw-bold mb-2 text-uppercase">
                                        {!showRegister ? "Connexion" : "Inscription"}
                                    </h2>
                                    <p className="text-white-50 mb-4">
                                        {!showRegister 
                                            ? "Veuillez entrer votre email et mot de passe" 
                                            : "Veuillez remplir le formulaire d'inscription"
                                        }
                                    </p>
                                    {showRegister && (
                                        <>
                                            <div className="form-outline form-white mb-4">
                                                <MDBInput 
                                                    type='text'
                                                    name='firstName'
                                                    value={firstName}
                                                    onChange={handleChange}
                                                    label='Prénom'
                                                    className='form-control form-control-lg'
                                                />
                                            </div>
                                            <div className="form-outline form-white mb-4">
                                                <MDBInput 
                                                    type='text'
                                                    name='lastName'
                                                    value={lastName}
                                                    onChange={handleChange}
                                                    label='Nom'
                                                    className='form-control form-control-lg'
                                                />
                                            </div>
                                        </>
                                    )}
                                    <div className="form-outline form-white mb-4">
                                        <MDBInput 
                                            type='email'
                                            name='email'
                                            value={email}
                                            onChange={handleChange}
                                            label='Email'
                                            className='form-control form-control-lg'
                                        />
                                    </div>
                                    <div className="form-outline form-white mb-4">
                                        <MDBInput 
                                            type='password'
                                            name='password'
                                            value={password}
                                            onChange={handleChange}
                                            label='Mot de passe'
                                            className='form-control form-control-lg'
                                        />
                                    </div>
                                    {showRegister && (
                                        <div className="form-outline form-white mb-4">
                                            <MDBInput 
                                                type='password'
                                                name='confirmPassword'
                                                value={confirmPassword}
                                                onChange={handleChange}
                                                label='Confirmez le mot de passe'
                                                className='form-control form-control-lg'
                                            />
                                        </div>
                                    )}
                                    {!showRegister ? (
                                        <button 
                                            className="btn btn-outline-light btn-lg px-5" 
                                            type='button'
                                            onClick={() => handleLogin()}
                                        >
                                            Connexion
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn btn-outline-light btn-lg px-5" 
                                            type='button'
                                            onClick={() => handleRegister()}
                                        >
                                            Inscription
                                        </button>
                                    )}
                                </div>
                                <div>
                                    <h5 className="mb-0">
                                        {!showRegister ? (
                                            <>
                                                Pas encore incrit ?
                                                <p 
                                                    className="text-white-50 fw-bold" 
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => setShowRegister(true)}
                                                >
                                                    S'inscrire
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                Êtes-vous déjà incrit ?
                                                <p 
                                                    className="text-white-50 fw-bold"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => setShowRegister(false)}
                                                >
                                                    Se connecter
                                                </p>
                                            </>
                                        )}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Auth