import { FORM_ERROR } from "final-form";
import { observer } from "mobx-react-lite";
import { Fragment, useContext, useState } from "react";
import { Form, Field } from "react-final-form";
import { combineValidators, isRequired } from "revalidate";

import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import { IUserFormValues } from "../../app/models/user";
import { RootStoreContext } from "../../app/stores/rootStore";
import ForgotPasswordForm from "./ForgotPasswordForm";
import SocialLoginFacebook from "./SocialLoginFacebook";
import SocialLoginInstagram from "./SocialLoginInstagram";
import { Button } from "../../app/components/Button";
import { Image } from "../../app/components/Image";
import { Typography } from "../../app/components/Typography";
import Icon from "../../app/components/Icon";
import { TwRegisterForm } from "./TwRegisterForm";

const validate = combineValidators({
  email: isRequired({ message: "Potrebno je uneti E-mail adresu" }),
  password: isRequired({ message: "Potrebno je uneti lozinku" }),
});

const TwLoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login, fbLogin, loading } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;

  const [toggleField, setToggleField] = useState(false);

  const toggleType = () => {
    setToggleField(toggleField ? false : true);
  };

  return (
    <div className="max-w-[490px] mx-auto">
      <Form
        onSubmit={(values: IUserFormValues) =>
          login(values).catch((error) => ({
            [FORM_ERROR]: error,
          }))
        }
        validate={validate}
        render={({
          handleSubmit,
          submitting,
          submitError,
          invalid,
          pristine,
          dirtySinceLastSubmit,
        }) => (
          <Fragment>
            <Image
              src="/assets/LogInEkvitiLogo.png"
              alt="Ekviti Logo"
              imageStyle="mx-auto pb-3 sm:pb-5"
            />

            <Typography
              variant={Typography.variant.h3}
              color={Typography.color.text}
              align={Typography.align.center}
              className="m-0 pb-3 sm:pb-5"
            >
              Dobrodošli nazad
            </Typography>

            <form autoComplete="off" onSubmit={handleSubmit} noValidate>
              <Field name="email">
                {({ input, label, meta: { error, touched } }) => (
                  <div className="relative z-0 w-full mb-3 sm:mb-6">
                    <Icon
                      iconName="envelope"
                      className="absolute w-[21px] h-auto top-[17px] sm:top-6 left-4 sm:left-5"
                    />

                    <input
                      type="email"
                      id="email"
                      className={`block bg-formBg rounded-md text-sm sm:text-base md:text-xl pb-2 pt-6 pl-12 sm:pl-16 h-14 sm:h-17 w-full peer focus:outline outline-2 outline-primary ${
                        touched && !!error
                          ? "outline outline-2 outline-error"
                          : ""
                      }`}
                      required
                      {...input}
                    />

                    <label
                      htmlFor="email"
                      className={`absolute top-2 left-12 sm:left-16 block ${
                        touched && !!error ? "text-error" : "text-primary"
                      } text-[12px] sm:text-base font-medium text-gray-900 dark:text-gray-300`}
                      {...label}
                    >
                      {touched && !!error ? error : "E-Mail"}
                    </label>
                  </div>
                )}
              </Field>

              <Field name="password">
                {({ input, label, meta: { error, touched } }) => (
                  <div className="relative z-0 w-full mb-3 sm:mb-6">
                    <Icon
                      iconName="password"
                      className="absolute w-[18px] h-[21px] top-[17px] sm:top-6 left-4 sm:left-5"
                    />

                    <input
                      type={toggleField ? "text" : "password"}
                      id="password"
                      className={`block bg-formBg rounded-md pl-12 pr-10 pb-2 pt-6 sm:pl-16 md:pr-11 text-sm sm:text-base md:text-xl h-14 sm:h-17 w-full peer ${
                        error && touched
                          ? "outline outline-2 outline-error"
                          : ""
                      } focus:outline outline-2 outline-primary`}
                      required
                      {...input}
                    />

                    <label
                      htmlFor="password"
                      className={`absolute top-2 left-12 sm:left-16 block ${
                        error && touched ? "text-error" : "text-primary"
                      } text-[12px] sm:text-base md:text-base font-medium text-gray-900 dark:text-gray-300"`}
                      {...label}
                    >
                      {error && touched ? error : "Lozinka"}
                    </label>

                    <Icon
                      iconName={toggleField ? "eyeSlash" : "eye"}
                      onClick={toggleType}
                      className="absolute w-[23px] h-[23px] top-[17px] sm:top-6 right-4 md:right-5"
                    />
                  </div>
                )}
              </Field>

              {submitError && !dirtySinceLastSubmit && (
                <ErrorMessage error={submitError} />
              )}

              <div className="flex justify-between items-center mb-3 sm:mb-5">
                <Field name="rememberMe" type="checkbox">
                  {({ input, label }) => (
                    <div className="flex items-center">
                      <input
                        id="rememberMe"
                        type="checkbox"
                        className="w-4 h-4 accent-primary rounded"
                        {...input}
                      />
                      <label
                        htmlFor="rememberMe"
                        className="ml-2 text-xs sm:text-sm font-medium text-text"
                        {...label}
                      >
                        Zapamti me
                      </label>
                    </div>
                  )}
                </Field>

                <Typography
                  variant={Typography.variant.subscript}
                  color={Typography.color.text}
                >
                  Zaboravljena lozinka?{" "}
                  <button
                    type="button"
                    className="text-primary underline"
                    onClick={() => openModal(<ForgotPasswordForm />)}
                  >
                    Resetuj je
                  </button>
                </Typography>
              </div>

              <Button
                disabled={(invalid && !dirtySinceLastSubmit) || pristine}
                loading={submitting}
                size={Button.size.md}
                type="submit"
                fullWidth              
              >
                Prijavi se
              </Button>
            </form>

            {/* <div className="relative flex gap-3 py-3 sm:py-5 items-center">
              <div className="flex-grow border-t-2 border-divider"></div>
              <Typography
                className="normal-case m-0"
                variant={Typography.variant.h4}
                color={Typography.color.text}
              >
                ili
              </Typography>
              <div className="flex-grow border-t-2 border-divider"></div>
            </div> */}

            <SocialLoginFacebook loading={loading} fbCallback={fbLogin} />
            <SocialLoginInstagram loading={loading} igCallback={fbLogin} />

            <Typography
              variant={Typography.variant.body}
              color={Typography.color.text}
              className="mt-4 sm:mt-5"
            >
              Nemaš nalog?{" "}
              <button
                type="button"
                className="text-primary underline"
                onClick={() => openModal(<TwRegisterForm />)}
              >
                Registracija.
              </button>
            </Typography>
          </Fragment>
        )}
      />
    </div>
  );
};

export default observer(TwLoginForm);
