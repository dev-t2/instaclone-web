import { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

import { signup, signupVariables } from '../__generated__/signup';
import { BoldLink, PageTitle } from '../component/common';
import { Link, Button, Error, Form, Input, Layout } from '../component/auth';
import { email, name, nickname, password } from '../valid';
import { HOME } from '../route';

const HeaderContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const SubTitle = styled(BoldLink)({
  textAlign: 'center',
  marginTop: '10px',
});

const SIGNUP_MUTATION = gql`
  mutation signup(
    $name: String!
    $nickname: String!
    $email: String!
    $password: String!
  ) {
    signup(
      name: $name
      nickname: $nickname
      email: $email
      password: $password
    ) {
      isSuccess
      error
    }
  }
`;

interface IForm {
  name: string;
  email: string;
  nickname: string;
  password: string;
  server: string;
}

const Signup = () => {
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    getValues,
    setError,
    clearErrors,
  } = useForm<IForm>({
    mode: 'onChange',
  });

  const [signup, { loading }] = useMutation<signup, signupVariables>(
    SIGNUP_MUTATION,
    {
      onCompleted: ({ signup: { isSuccess, error } }) => {
        if (!isSuccess) {
          return setError('server', { message: error ?? '' });
        }

        const { nickname, password } = getValues();

        history.replace(HOME, {
          nickname,
          password,
        });
      },
    }
  );

  const onValid: SubmitHandler<IForm> = useCallback(
    ({ name, nickname, email, password }) => {
      if (loading) return;

      signup({ variables: { name, nickname, email, password } });
    },
    [loading, signup]
  );

  const onFocus = useCallback(() => {
    clearErrors('server');
  }, [clearErrors]);

  return (
    <Layout>
      <PageTitle title="Signup" />

      <Form>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <SubTitle>???????????? ????????? ????????? ???????????????.</SubTitle>
        </HeaderContainer>

        <form autoComplete="off" onSubmit={handleSubmit(onValid)}>
          <Input
            type="text"
            {...register('name', name)}
            placeholder="??????"
            isError={errors.name}
            onFocus={onFocus}
          />
          <Error message={errors.name?.message} />

          <Input
            type="text"
            {...register('nickname', nickname)}
            placeholder="?????????"
            isError={errors.nickname}
            onFocus={onFocus}
          />
          <Error message={errors.nickname?.message} />

          <Input
            type="email"
            {...register('email', email)}
            placeholder="?????????"
            isError={errors.email}
            onFocus={onFocus}
          />
          <Error message={errors.email?.message} />

          <Input
            type="password"
            {...register('password', password)}
            placeholder="????????????"
            isError={errors.password}
            onFocus={onFocus}
          />
          <Error message={errors.password?.message} />

          <Button type="submit" disabled={!isValid || loading}>
            {loading ? '?????? ???...' : '??????'}
          </Button>

          <Error message={errors.server?.message} />
        </form>
      </Form>

      <Link text="????????? ????????????????" link={HOME} linkText="?????????" />
    </Layout>
  );
};

export default memo(Signup);
