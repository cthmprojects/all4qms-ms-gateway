import React, { useRef } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';
import { Button } from '@mui/material';

type CustomInputType = {
  onChange: (payload: any) => void;
  download?: () => void;
};

export const AttachmentButton = ({ onChange, download }: CustomInputType) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const files = inputRef.current?.files;

  return (
    <>
      <input
        onChange={event => {
          onChange([].slice.call(event.target.files));
        }}
        type="file"
        multiple={true}
        style={{ position: 'absolute', height: '0px', width: '0px' }}
        ref={inputRef}
      />
      <div>
        <Button
          variant="contained"
          sx={{ borderRadius: '54px', backgroundColor: '#E0E0E0 !important', color: '#384150' }}
          color="info"
          onClick={download || (() => inputRef.current.click())}
        >
          {download ? <DownloadIcon /> : <AttachFileIcon />} Arquivo
        </Button>
        {!!files?.length && <div>{`${files.length} arquivo(s) selecionado(s)`}</div>}
      </div>
    </>
  );
};
