import Modal from "../Ui/Modal.jsx";
import { useState } from "react";
import { clearErrorOnInputChange, validateInputs } from "../../Utils/Main.js";
import { useLoaderStore } from "../../Store/Loader.js";
import { useUserStore } from "../../Store/User.js";
import InputLabel from "../Ui/InputLabel.jsx";
import Input from "../Ui/Input.jsx";
import PropTypes from "prop-types";
import Button from "../Ui/Button.jsx";

function Login({ changeAuthorizationState }) {
  const { showLoader, hideLoader } = useLoaderStore();
  const { loginUser } = useUserStore();

  const defaultFormData = {
    login: '',
    password: '',
    remember: false,
  };

  const defaultErrorData = {
    errorLoginMsg: '',
    errorPasswordMsg: '',
  };

  const errorKeys = Object.keys(defaultFormData).reduce((acc, key, index) => {
    acc[key] = Object.keys(defaultErrorData)[index] || '';
    return acc;
  }, {});

  const [value, setValue] = useState(defaultFormData);
  const [error, setError] = useState(defaultErrorData);

  const handleChange = (e) => {
    const { name, type, value: val, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : val;

    setValue((prev) => ({ ...prev, [name]: newValue }));

    if (errorKeys[name]) {
      clearErrorOnInputChange(errorKeys[name], setError);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rules = {
      login: {
        required: true,
        type: 'text',
        minLength: 5,
        message: 'Login must be at least 5 characters long',
      },
      password: {
        required: true,
        type: 'text',
        minLength: 5,
        message: 'Password must be at least 5 characters long',
      },
    };

    const validationResult = validateInputs(value, rules);

    const newErrors = Object.keys(defaultErrorData).reduce((acc, key) => {
      const field = key.replace(/^error/, '').replace(/Msg$/, '');
      const fieldName = field.charAt(0).toLowerCase() + field.slice(1);
      acc[key] = validationResult[fieldName] || '';
      return acc;
    }, {});

    const hasErrors = Object.values(newErrors).some((msg) => msg !== '');

    if (hasErrors) {
      setError(newErrors);
      return;
    }

    try {
      showLoader();
      const response = await loginUser(value.login, value.password, value.remember);


      if (response.status === 200) {
        console.log('Authentication successful:', response);
        // Example: save rememberMe flag to localStorage
        if (value.remember) {
          localStorage.setItem('rememberedLogin', value.login);
        }
        return;
      }

      if (response.response?.status === 401) {
        const message = response.response.data?.error || '';
        if (message.toLowerCase().includes('invalid')) {
          setError({
            ...defaultErrorData,
            errorLoginMsg: 'Invalid login or password',
            errorPasswordMsg: 'Invalid login or password',
          });
        }
      }

    } catch (err) {
      setError({
        ...defaultErrorData,
        errorLoginMsg: 'Network error occurred',
        errorPasswordMsg: 'Network error occurred',
      });
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Modal>
        <form onSubmit={handleSubmit} className="w-full  ">
          <InputLabel text="Login"/>
          <div className={` w-full mt-[12px] ${error.errorLoginMsg && 'border-2 border-red-600 rounded-[10px]'}`}>
            <Input
              name="login"
              type="text"
              placeholder="Enter your login"
              value={value.login}
              setValue={handleChange}
            />
          </div>
          <span className="text-red-500">{error.errorLoginMsg && error.errorLoginMsg}</span>

          <div className="mt-[24px]">
            <InputLabel text="Password"/>
            <div className={`mt-[12px] ${error.errorPasswordMsg && 'border-2 border-red-600 rounded-[10px]'}`}>
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={value.password}
                setValue={handleChange}
              />
            </div>
            <span className="text-red-500">{error.errorPasswordMsg && error.errorPasswordMsg}</span>
          </div>

          <div className="mt-[20px] flex justify-between items-center cursor-pointer select-none">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={value.remember}
                onChange={handleChange}
              />
              <span className="ml-[4px]">Remember me</span>
            </label>
            <a href="#" className="text-blue-500 hover:underline">Forgot password?</a>
          </div>

          <div className="mt-[40px] cursor-pointer duration-300 hover:scale-103 select-none">
            <Button
              type="submit"
              className="w-full"
            >
              Sign in
            </Button>
          </div>
            <div className="m-auto w-full flex justify-center mt-4">
              Don't have an account?
              <a onClick={changeAuthorizationState} className="ml-[4px] text-blue-500 hover:underline cursor-pointer">
                Register
              </a>
            </div>
        </form>
      </Modal>
    </div>
);
}

Login.propTypes = {
  changeAuthorizationState: PropTypes.func.isRequired,
};

export default Login;
