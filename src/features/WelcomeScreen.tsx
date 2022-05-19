import { Fragment, useContext } from "react";

import { RootStoreContext } from "../app/stores/rootStore";
import { Button } from "../app/components/Button";
import { Image } from "../app/components/Image";
import { Typography } from "../app/components/Typography";
import TwLoginForm from "./user/TwLoginForm";
import { TwRegisterForm } from "./user/TwRegisterForm";


const WelcomeScreen = () => {
  const rootStore = useContext(RootStoreContext);
  const { openModal } = rootStore.modalStore;
  const { isLoggedIn, user } = rootStore.userStore;
  const token = window.localStorage.getItem("jwt");

  return (
    <Fragment>
      <main
        style={{ backgroundImage: "url(/assets/WelcomeBackground.png)" }}
        className="h-screen bg-cover bg-center grid grid-rows-[auto_min-content] items-center"
      >
        <div className="container mx-auto">
          <Image
            imageStyle="mx-auto"
            src="/assets/RegistrationEkvitiLogo.png"
            alt="Ekviti Logo"
          />
          <Typography>Za bolje danas!</Typography>
        </div>

        <section className="bg-primary">
          <div className="container mx-auto">
            {isLoggedIn && user && token ? (
              <div className="grid grid-cols-1 px-5 md:px-0 py-10 md:py-0 md:grid-cols-welcome items-center">
                <Image
                  imageStyle="hidden md:block md:-translate-y-8"
                  src="/assets/KnightRegistration.png"
                  alt="Vitez"
                />
                <Typography
                  variant={Typography.variant.h2}
                  color={Typography.color.white}
                  className="col-span-2"
                >
                  Već ste prijavljeni
                </Typography>
              </div>
            ) : (
              <Fragment>
                <div className="grid grid-cols-1 px-5 md:px-0 py-10 md:py-0 md:grid-cols-welcome gap-5 md:gap-12 items-center">
                  <Image
                    imageStyle="hidden md:block md:-translate-y-8"
                    src="/assets/KnightRegistration.png"
                    alt="Vitez"
                  />

                  <Button
                    variant={Button.variant.primaryOutlined}
                    size={Button.size.lg}
                    fullWidth
                    onClick={() => openModal(<TwLoginForm />, true, true)}
                  >                    
                    Prijavi se
                  </Button>

                  <Button                  
                    variant={Button.variant.primaryOutlined}
                    size={Button.size.lg}
                    fullWidth
                    onClick={() => openModal(<TwRegisterForm />, true, true)}
                  >                    
                    Registruj se  
                  </Button>
                </div>
              </Fragment>
            )}
          </div>
        </section>
      </main>
    </Fragment>
  );
};

export default WelcomeScreen;
