import { Typography } from "@material-tailwind/react";
 
export function FooterWithLogo() {
  return (
    <footer className="w-full bg-deep_orange-700 p-8">
      <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-deep_orange-700 text-center md:justify-between">
        <img src="orangen.png" alt="Narrato" className="w-10" />
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          <li>
            <Typography
              as="a"
              href="#"
              color="white"
              className="font-normal transition-colors hover:text-black focus:text-black"
            >
              About Us
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="white"
              className="font-normal transition-colors hover:text-black focus:text-black"
            >
              License
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="white"
              className="font-normal transition-colors hover:text-black focus:text-black"
            >
              Contribute
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="white"
              className="font-normal transition-colors hover:text-black focus:text-black"
            >
              Contact Us
            </Typography>
          </li>
        </ul>
      </div>
      <hr className="my-8 border-white" />
      <Typography color="white" className="text-center font-normal">
        &copy; 2023 Narrato
      </Typography>
    </footer>
  );
}