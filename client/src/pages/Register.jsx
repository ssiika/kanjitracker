import { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {FaUser} from 'react-icons/fa';
import {register, reset} from '../features/authentication/authSlice';
import Spinner from '../components/Spinner'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    pwConfirm: '',
  })

  const [localError, setLocalError] = useState('');

  const { username, password, pwConfirm } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {user, isLoading, isSuccess, message} = useSelector(
    (state) => state.auth
  )
  
  useEffect(() => {

    if (isSuccess || user) {
      navigate('/')
    }

    dispatch(reset())

  }, [user, isSuccess, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== pwConfirm) {
      setLocalError('Passwords do not match')
    } else {
      setLocalError('')
      // Register user
      const userData = {
        username,
        password,
      }

      dispatch(register(userData));
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div>
      <section className="heading">
        <h1>
          <FaUser /> Register
        </h1>
      </section>
      <section className="form">
        <form className="registerForm" onSubmit={onSubmit}>
          <div className="form-group">
            <input type="text" 
            className='form-control'
            id='username' 
            name='username' 
            value={username} 
            placeholder='Enter username'
            onChange={onChange} />
          </div>
          <div className="form-group">
            <input type="password" 
            className='form-control'
            id='password' 
            name='password' 
            value={password} 
            placeholder='Enter password'
            onChange={onChange} />
          </div>
          <div className="form-group">
            <input type="password" 
            className='form-control'
            id='pwConfirm' 
            name='pwConfirm' 
            value={pwConfirm} 
            placeholder='Confirm password'
            onChange={onChange} />
          </div>
          <div className="errorbox">{localError ? localError : message}</div>
          <div className="form-group">
            <button type='submit' className='btn btn-block'>
              Submit
            </button>
          </div>
          
        </form>
      </section>
    </div>
  )
}

export default Register