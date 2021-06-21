import { memo, useCallback } from 'react';
import { gql, useMutation } from '@apollo/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

import { setToken } from '../apollo';
import { PageTitle } from '../component/common';
import { Link, Button, Error, Form, Input, Layout } from '../component/auth';
import { nickname, password } from '../valid';
import { SIGNUP } from '../route';

const LOGIN_MUTATION = gql`
  mutation login($nickname: String!, $password: String!) {
    login(nickname: $nickname, password: $password) {
      isSuccess
      token
      error
    }
  }
`;

interface IForm {
  nickname?: string;
  password?: string;
  server?: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    setError,
    clearErrors,
  } = useForm<IForm>({
    mode: 'onChange',
  });

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: ({ login: { isSuccess, token, error } }) => {
      if (!isSuccess) {
        return setError('server', { message: error });
      }

      if (token) {
        setToken(token);
      }
    },
  });

  const onValid: SubmitHandler<IForm> = useCallback(
    ({ nickname, password }) => {
      if (loading) return;

      login({
        variables: { nickname, password },
      });
    },
    [loading, login]
  );

  const onFocus = useCallback(() => {
    clearErrors('server');
  }, [clearErrors]);

  return (
    <Layout>
      <PageTitle title="Login" />

      <Form>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>

        <form onSubmit={handleSubmit(onValid)}>
          <Input
            type="text"
            {...register('nickname', nickname)}
            placeholder="닉네임"
            isError={errors.nickname}
            onFocus={onFocus}
          />
          <Error message={errors.nickname?.message} />

          <Input
            type="password"
            {...register('password', password)}
            placeholder="비밀번호"
            isError={errors.password}
            onFocus={onFocus}
          />
          <Error message={errors.password?.message} />

          <Button type="submit" disabled={!isValid || loading}>
            {loading ? '로딩 중...' : '로그인'}
          </Button>

          <Error message={errors.server?.message} />
        </form>
      </Form>

      <Link text="계정이 없으신가요?" link={SIGNUP} linkText="가입하기" />
    </Layout>
  );
};

export default memo(Login);
