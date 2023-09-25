import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  showRules: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, showRules, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {showRules ? (
        <IconButton
          aria-label="close"
          onClick={showRules}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export interface RulesProps {
  status: boolean;
  showRules: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

export default function Rules({ status, showRules }: RulesProps) {
  return (
    <div>
      <BootstrapDialog onClose={showRules} aria-labelledby="customized-dialog-title" open={status}>
        <BootstrapDialogTitle id="customized-dialog-title" showRules={showRules}>
          Pong's rules
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            1. A Game is played until one of the player wins 5 points or leaves.
          </Typography>
          <Typography gutterBottom>2. Players alternate serving one point at a time.</Typography>
          <Typography gutterBottom>
            3. Players use the 'up' and 'down' key of their keyboard to move their paddle up or
            down.
          </Typography>
          <Typography gutterBottom>
            4. If the ball doesn't bounce off the player's paddle, he loses the point.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={showRules}>
            Understood
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
