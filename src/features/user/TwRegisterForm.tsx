import { FORM_ERROR } from "final-form";
import { Fragment, useContext, useState } from "react";
import { Form, Field } from "react-final-form";
import {
  combineValidators,
  composeValidators,
  isRequired,
  matchesField,
} from "revalidate";

import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import Icon from "../../app/components/Icon";
import { Typography } from "../../app/components/Typography";
import { IUserFormValues } from "../../app/models/user";
import { RootStoreContext } from "../../app/stores/rootStore";
import { Button } from "../../app/components/Button";
import { Image } from "../../app/components/Image";
import TwLoginForm from "./TwLoginForm";

const validate = combineValidators({
  email: isRequired({ message: "Potrebno je uneti vašu E-mail adresu" }),
  password: isRequired({ message: "Potrebno je uneti vašu lozinku" }),
  username: isRequired({ message: "Potrebno je uneti Korisničko ime" }),
  passwordConfirm: composeValidators(
    isRequired({ message: "Potrebno je ponovo uneti vašu lozinku" }),
    matchesField(
      "password",
      "Lozinka"
    )({
      message: "Potrebno je ponovo uneti vašu lozinku",
    })
  )(),
});

export const TwRegisterForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { register } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;

  const [toggleField, setToggleField] = useState(false);  

  const toggleType = () => {
    setToggleField(toggleField ? false : true);    
  };

  return (
    <Form
      onSubmit={(values: IUserFormValues) =>
        register(values).catch((error) => ({
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
              imageStyle="mx-auto pb-5 md:pb-8"
            />

            <Typography
              variant={Typography.variant.h3}
              color={Typography.color.text}
              align={Typography.align.center}
              className="m-0 pb-5 md:pb-12"
            >
              Napravite novi nalog.
            </Typography>

            <form autoComplete="off" onSubmit={handleSubmit} noValidate>
              <Field name="username">
                {({ input, label, meta: { error, touched } }) => (
                  <div className="relative z-0 w-full mb-6">
                    <Icon
                      iconName="user"
                      className="absolute w-[21px] h-auto top-6 left-4 md:left-5"
                    />

                    <input
                      type="text"
                      id="username"
                      className={`block bg-formBg rounded-md text-base md:text-xl pb-4 pt-9 pl-14 md:pl-16 h-17 w-full peer focus:outline outline-2 outline-primary ${
                        touched && !!error
                          ? "outline outline-2 outline-error"
                          : ""
                      }`}
                      required
                      {...input}
                    />

                    <label
                      htmlFor="username"
                      className={`absolute top-3 left-14 md:left-16 block ${
                        touched && !!error ? "text-error" : "text-primary"
                      } mb-2 text-sm md:text-base font-medium text-gray-900 dark:text-gray-300`}
                      {...label}
                    >
                      {touched && !!error ? error : "Korisničko ime"}
                    </label>
                  </div>
                )}
              </Field>

              <Field name="email">
                {({ input, label, meta: { error, touched } }) => (
                  <div className="relative z-0 w-full mb-6">
                    <Icon
                      iconName="envelope"
                      className="absolute w-[21px] h-auto top-6 left-4 md:left-5"
                    />

                    <input
                      type="email"
                      id="email"
                      className={`block bg-formBg rounded-md text-base md:text-xl pb-4 pt-9 pl-14 md:pl-16 h-17 w-full peer focus:outline outline-2 outline-primary ${
                        touched && !!error
                          ? "outline outline-2 outline-error"
                          : ""
                      }`}
                      required
                      {...input}
                    />

                    <label
                      htmlFor="email"
                      className={`absolute top-3 left-14 md:left-16 block ${
                        touched && !!error ? "text-error" : "text-primary"
                      } mb-2 text-sm md:text-base font-medium text-gray-900 dark:text-gray-300`}
                      {...label}
                    >
                      {touched && !!error ? error : "E-Mail"}
                    </label>
                  </div>
                )}
              </Field>

              <Field name="password">
                {({ input, label, meta: { error, touched } }) => (
                  <div className="relative z-0 w-full mb-6">
                    <Icon
                      iconName="password"
                      className="absolute w-[18px] h-[21px] top-6 left-4 md:left-5"
                    />

                    <input
                      type={toggleField ? "text" : "password"}
                      id="password"
                      className={`block bg-formBg rounded-md pl-14 pr-10 md:pl-16 md:pr-11 text-xl pb-4 pt-9 h-17 w-full peer ${
                        error && touched
                          ? "outline outline-2 outline-error"
                          : ""
                      } focus:outline outline-2 outline-primary`}
                      required
                      {...input}
                    />

                    <label
                      htmlFor="password"
                      className={`absolute top-3 left-14 md:left-16 block ${
                        error && touched ? "text-error" : "text-primary"
                      } mb-2 text-sm md:text-base font-medium text-gray-900 dark:text-gray-300"`}
                      {...label}
                    >
                      {error && touched ? error : "Lozinka"}
                    </label>

                    <Icon
                      iconName={toggleField ? "eyeSlash" : "eye"}
                      onClick={toggleType}
                      className="absolute w-[23px] h-[23px] top-6 right-4 md:right-5"
                    />
                  </div>
                )}
              </Field>

              <Field name="passwordConfirm">
                {({ input, label, meta: { error, touched } }) => (
                  <div className="relative z-0 w-full mb-6">
                    <Icon
                      iconName="password"
                      className="absolute w-[18px] h-[21px] top-6 left-4 md:left-5"
                    />

                    <input
                      type={toggleField ? "text" : "password"}
                      id="passwordConfirm"
                      className={`block bg-formBg rounded-md pl-14 pr-10 md:pl-16 md:pr-11 text-xl pb-4 pt-9 h-17 w-full peer ${
                        error && touched
                          ? "outline outline-2 outline-error"
                          : ""
                      } focus:outline outline-2 outline-primary`}
                      required
                      {...input}
                    />

                    <label
                      htmlFor="passwordConfirm"
                      className={`absolute top-3 left-14 md:left-16 block ${
                        error && touched ? "text-error" : "text-primary"
                      } mb-2 text-sm md:text-base font-medium text-gray-900 dark:text-gray-300"`}
                      {...label}
                    >
                      {error && touched ? error : "Ponovi lozinku"}
                    </label>

                    <Icon
                      iconName={toggleField ? "eyeSlash" : "eye"}
                      onClick={toggleType}
                      className="absolute w-[23px] h-[23px] top-6 right-4 md:right-5"
                    />
                  </div>
                )}
              </Field>

              {submitError && !dirtySinceLastSubmit && (
                <ErrorMessage error={submitError} />
              )}

              <Button
                disabled={(invalid && !dirtySinceLastSubmit) || pristine}
                loading={submitting}
                size={Button.size.md}
                fullWidth
              >
                Prijavi se
              </Button>
            </form>

            <Typography
            variant={Typography.variant.body}
            color={Typography.color.text}
            className="mt-5"
          >
            Već imaš nalog?{" "}
            <button
              className="text-primary underline"
              onClick={() => openModal(<TwLoginForm />)}
            >
              Prijava.
            </button>
          </Typography>
                      
        </Fragment>
      )}
    />
  );
};
