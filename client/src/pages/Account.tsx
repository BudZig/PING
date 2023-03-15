import React, { useContext } from 'react';
import { Context } from '../Context';
import { Typography, MenuItem } from '@mui/material';
import {
  StyledTextField,
  StyledSelect,
  StyledButton,
} from '../components/ui/StyledComponents';


const Account = () => {
  const { currentUser, setCurrentUser, handleUpdateUser } = useContext(Context);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateUser && handleUpdateUser();
  };
  if (setCurrentUser && currentUser)
  return (
    <div className="center">
      <Typography variant="h4">Account Settings</Typography>
      <form onSubmit={handleSubmit}>
        <br />
        <StyledTextField
          label="Username"
          className="input"
          variant="outlined"
          value={currentUser?.username}
          onChange={(e) =>
            setCurrentUser({ ...currentUser, username: e.target.value })
          }
        />
        <br />
        <br />
        <Typography variant="h6" sx={{ color: '#8793a2', fontSize: 13 }}>
          Role{' '}
        </Typography>
        <br />
        <StyledSelect
          className="form-control"
          id="role"
          value={currentUser.role}
          sx={{ mt: '0.3rem' }}
          onChange={(e) =>
            setCurrentUser({ ...currentUser, role: e.target.value as string })
          }
        >
          <MenuItem value="Helpee">Helpee</MenuItem>
          <MenuItem value="Helper">Helper</MenuItem>
        </StyledSelect>
        <br />
        <br />
        <StyledButton type="submit" variant="contained">
          Update profile
        </StyledButton>
      </form>
    </div>
  );
};

export default Account;
