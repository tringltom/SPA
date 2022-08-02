import { Image } from "../../app/components/Image";
import { Button } from "../../app/components/Button";
import { Typography } from "../components/Typography";
import { history } from '../..';

const TwNotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 text-center bg-[#7D36DC]"> 
        <div className="w-full sm:max-w-modal transform overflow-hidden rounded-2xl bg-white p-6 md:py-8 md:px-20 align-middle shadow-xl transition-all">
            <Image
                imageStyle="mx-auto mt-8"
                src="/assets/ekviti-logo.svg"
                alt="Ekviti logo"
            />
            <Image
                imageStyle="mx-auto py-8"
                src="/assets/KnightConfused.png"
                alt="Vitez"
            />
            <Typography variant={Typography.variant.h3} color={Typography.color.text}>
                Ooops!</Typography>
            <Typography variant={Typography.variant.body} className="md:pb-5">
                Sve smo pretražili, ali ovu putanju nismo pronašli.</Typography>
            <Button
                onClick={() => history.push("/")}
                variant={Button.variant.primary}              
                size={Button.size.md}
                className="shadow-[0_8px_10px_-6px_rgba(1,183,255,1)]"
                fullWidth
                >Vrati se na početnu</Button>
        </div>
    </div>
)};

export default TwNotFound;
