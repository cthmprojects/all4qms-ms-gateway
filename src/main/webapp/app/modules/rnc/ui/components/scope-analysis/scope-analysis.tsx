import { AddCircle, LocalOffer } from '@mui/icons-material';
import { Card, CardContent, Chip, IconButton, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Hashtag } from 'app/modules/rnc/models';
import { postHashtagRNC } from 'app/modules/rnc/reducers/hashtag.reducer';
import React, { useEffect, useState } from 'react';

type ScopeAnalysisProps = {
  keywords: Array<string>;
  onChanged: (value: Array<string>) => void;
};

const ScopeAnalysis = ({ keywords, onChanged }: ScopeAnalysisProps) => {
  const [keyword, setKeyword] = useState<string>('');
  const hashtags = useAppSelector<Hashtag[]>(state => state.all4qmsmsgateway.hashtag.hashtags);
  const dispatch = useAppDispatch();
  const onKeywordAdded = (event: React.MouseEvent<HTMLButtonElement>): void => {
    dispatch(postHashtagRNC(keyword));
  };
  useEffect(() => {
    const hashtagAddedKeywords = [...keywords].concat(hashtags.map(h => h.hashtag));
    onChanged(hashtagAddedKeywords);
    setKeyword('');
  }, [hashtags]);

  const onKeywordChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setKeyword(value);
  };

  const onKeywordRemoved = (event: any, index: number): void => {
    const newKeywords: Array<string> = keywords.filter((_, idx) => idx !== index);
    onChanged(newKeywords);
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Análise de Abrangência da NC
        </Typography>
        <br />
        <div style={{ display: 'flex', alignItems: 'center' }} className="mt-2 mb-2">
          <span className="me-2" style={{ fontWeight: '500', fontSize: '16px', marginTop: '0px', color: '#384150' }}>
            Palavra chave
          </span>
          <LocalOffer sx={{ color: '#707070' }} />
          <TextField
            className="ms-2"
            id="text-field-keyword"
            label="Escreva aqui..."
            style={{ width: '40%', maxWidth: '400px', minWidth: '200px' }}
            onChange={onKeywordChanged}
            value={keyword}
          />
          <IconButton aria-label="Adicionar palavra chave" onClick={onKeywordAdded}>
            <AddCircle fontSize="large" />
          </IconButton>
        </div>
        <div className="p-2 mt-3" style={{ width: '100%', border: '1px solid #c6c6c6', borderRadius: '4px', minHeight: '100px' }}>
          {keywords.map((keyword: string, index: number) => (
            <Chip label={keyword} onDelete={event => onKeywordRemoved(event, index)} className="me-2" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScopeAnalysis;
