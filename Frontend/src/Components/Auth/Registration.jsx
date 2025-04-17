import Modal from "../Ui/Modal.jsx";
import { useState } from "react";
import {
  clearErrorOnInputChange,
  handleGeneratePassword,
  validateInputs
} from "../../Utils/Main.js";
import { useLoaderStore } from "../../Store/Loader.js";
import InputLabel from "../Ui/InputLabel.jsx";
import Input from "../Ui/Input.jsx";
import PropTypes from "prop-types";
import Button from "../Ui/Button.jsx";
import { registerUser } from "../../Api/Auth.js";
import { useUserStore } from "../../Store/User.js";

function Registration({ changeAuthorizationState }) {
  const { showLoader, hideLoader } = useLoaderStore();
  const { loginUser, checkAuth } = useUserStore();

  const defaultFormData = {
    name: '',
    surname: '',
    login: '',
    password: '',
    offer: false
  };

  const defaultErrorData = {
    errorNameMsg: '',
    errorSurnameMsg: '',
    errorLoginMsg: '',
    errorPasswordMsg: '',
    errorOfferMsg: '',
  };

  const errorKeys = Object.keys(defaultFormData).reduce((acc, key, index) => {
    acc[key] = Object.keys(defaultErrorData)[index];
    return acc;
  }, {});

  const [value, setValue] = useState(defaultFormData);
  const [error, setError] = useState(defaultErrorData);

  const handleChange = (e) => {
    const { name, type, value: val, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : val;
    setValue((prev) => ({ ...prev, [name]: newValue }));
    clearErrorOnInputChange(errorKeys[name], setError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rules = {
      name: {
        required: true,
        type: 'text',
        minLength: 2,
        message: 'Name must be at least 2 characters',
      },
      surname: {
        required: true,
        type: 'text',
        minLength: 2,
        message: 'Surname must be at least 2 characters',
      },
      offer: {
        required: true,
        type: 'boolean',
        message: 'You must agree to the terms',
      },
      login: {
        required: true,
        type: 'text',
        minLength: 5,
        message: 'Login must be at least 5 characters',
      },
      password: {
        required: true,
        type: 'text',
        minLength: 5,
        message: 'Password must be at least 5 characters',
      },
    };

    const validationResult = validateInputs(value, rules);

    const newErrors = Object.keys(defaultErrorData).reduce((acc, key) => {
      const originalKey = key.replace(/^error/, '').replace(/Msg$/, '');
      const lowerCaseKey = originalKey.charAt(0).toLowerCase() + originalKey.slice(1);
      acc[key] = validationResult[lowerCaseKey] || '';
      return acc;
    }, {});

    const hasErrors = Object.values(newErrors).some((msg) => msg !== '');

    if (hasErrors) {
      setError(newErrors);
      return;
    }

    try {
      showLoader();

      const response = await registerUser({
        name: value.name,
        surname: value.surname,
        login: value.login,
        password: value.password,
        offer: value.offer
      });

      if (response.status === 200 || response.status === 201) {
        await checkAuth();
        return;
      }

      if (response.response?.status === 400) {
        const backendErrors = response.response.data?.errors || {};
        const mappedErrors = { ...defaultErrorData };

        if (backendErrors.name) mappedErrors.errorNameMsg = backendErrors.name;
        if (backendErrors.surname) mappedErrors.errorSurnameMsg = backendErrors.surname;
        if (backendErrors.login) mappedErrors.errorLoginMsg = backendErrors.login;
        if (backendErrors.password) mappedErrors.errorPasswordMsg = backendErrors.password;
        if (backendErrors.offer) mappedErrors.errorOfferMsg = backendErrors.offer;

        setError(mappedErrors);
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

  const handleUpdatePassword = () => {
    const newPassword = handleGeneratePassword();
    const field = "password";
    setValue((prev) => ({ ...prev, [field]: newPassword }));
    clearErrorOnInputChange(errorKeys[field], setError);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Modal>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center">
            <div className="mr-[15px]">
              <InputLabel text={'Name'} />
              <div className={`w-full mt-[12px] ${error.errorNameMsg && 'border-2 border-red-600 rounded-[10px]'}`}>
                <Input
                  name="name"
                  type="text"
                  placeholder="John"
                  value={value.name}
                  setValue={handleChange}
                />
              </div>
              <span className="text-red-500">{error.errorNameMsg}</span>
            </div>
            <div>
              <InputLabel text={'Surname'} />
              <div className={`w-full mt-[12px] ${error.errorSurnameMsg && 'border-2 border-red-600 rounded-[10px]'}`}>
                <Input
                  name="surname"
                  type="text"
                  placeholder="Doe"
                  value={value.surname}
                  setValue={handleChange}
                />
              </div>
              <span className="text-red-500">{error.errorSurnameMsg}</span>
            </div>
          </div>

          <div className="mt-[20px]">
            <InputLabel text={'Login'} />
            <div className={`mt-[10px] ${error.errorLoginMsg && 'border-2 border-red-600 rounded-[10px]'}`}>
              <Input
                name="login"
                type="text"
                placeholder="Enter your login"
                value={value.login}
                setValue={handleChange}
              />
            </div>
            <span className="text-red-500">{error.errorLoginMsg}</span>
          </div>

          <div className="mt-[20px]">
            <div className="flex justify-between items-center cursor-pointer select-none">
              <InputLabel text={'Create a password'} />
              <div onClick={handleUpdatePassword}>
                <InputLabel text={'Generate'} />
              </div>
            </div>
            <div className={`mt-[10px] ${error.errorPasswordMsg && 'border-2 border-red-600 rounded-[10px]'}`}>
              <Input
                name="password"
                type="password"
                placeholder="Enter password"
                value={value.password}
                setValue={handleChange}
              />
            </div>
            <span className="text-red-500">{error.errorPasswordMsg}</span>
          </div>

          <div className="mt-[20px] flex justify-between items-center cursor-pointer select-none">
            <label className="flex items-center cursor-pointer">
              <input
                name="offer"
                checked={value.offer}
                onChange={handleChange}
                type="checkbox"
              />
              <span className="ml-[4px] text-[15px] font-normal text-text-secondary">I agree to the <a href="#">terms</a></span>
            </label>
          </div>
          <span className="text-red-500">{error.errorOfferMsg}</span>

          <div className="mt-[40px] cursor-pointer duration-300 hover:scale-103 select-none">
            <Button className="w-full" onClick={handleSubmit}>Create account</Button>
          </div>

          <div className="m-auto w-full flex justify-center mt-4">
            <span>Already have an account?
              <a onClick={changeAuthorizationState} className="ml-[5px]" href="#">
                Sign in
              </a>
            </span>
          </div>
        </form>
      </Modal>
    </div>
  );
}

Registration.propTypes = {
  changeAuthorizationState: PropTypes.func.isRequired,
};

export default Registration;
