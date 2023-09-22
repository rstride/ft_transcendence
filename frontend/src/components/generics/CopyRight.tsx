import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://github.com/rstride/"
      >
        rstide
      </Link>{" "}
      <Link
        color="inherit"
        href="https://github.com/nargin/"
      >
        romaurel
      </Link>{" "}
      <Link
        color="inherit"
        href="https://github.com/tsrun/"
      >
        masserie
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
};

export default Copyright;
