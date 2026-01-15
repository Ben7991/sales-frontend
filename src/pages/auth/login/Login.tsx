import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LuLock, LuUserCog } from "react-icons/lu";

import { login, loginSchema } from "./Login.utils";
import type { LoginInputs } from "./Login.types";
import { Form } from "@/components/atoms/form/Form";
import { AuthLayout } from "@/components/layouts/auth/Auth";
import { Button } from "@/components/atoms/button/Button";
import { Spinner } from "@/components/atoms/spinner/Spinner";
import { Alert } from "@/components/molecules/alert/Alert";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import { useAppDispatch } from "@/store/index.util";
import { setAuthUser } from "@/store/slice/auth/auth.slice";

export function Login(): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const rememberMeRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { state, alertDetails, showAlert, hideAlert, setAlertDetails } =
    useAlert();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginInputs>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const togglePassword = (): void => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit: SubmitHandler<LoginInputs> = async (data): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await login({
        ...data,
        rememberMe: rememberMeRef.current?.checked,
      });
      dispatch(
        setAuthUser({
          user: response.data,
        })
      );
      navigate("/dashboard");
    } catch (error) {
      setAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
      showAlert();
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <AuthLayout
      title="Sign-in your account"
      description="Please enter your email and password to access your account settings and dashboard."
    >
      {state ? (
        <Alert
          variant={alertDetails?.variant ?? "error"}
          message={alertDetails?.message ?? ""}
          onHide={hideAlert}
        />
      ) : null}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="userName">Username</Form.Label>
          <Form.Control
            type="text"
            id="userName"
            placeholder="Enter your username"
            leftIcon={<LuUserCog className="text-xl" />}
            {...register("usernameOrEmail")}
            hasError={Boolean(errors.usernameOrEmail)}
          />
          {Boolean(errors.usernameOrEmail) && (
            <Form.Error>{errors.usernameOrEmail?.message}</Form.Error>
          )}
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter your password"
            leftIcon={<LuLock className="text-xl" />}
            {...register("password")}
            hasError={Boolean(errors.password)}
            rightIcon={
              <Form.PasswordToggler
                state={showPassword}
                onClick={togglePassword}
              />
            }
          />
          {Boolean(errors.password) && (
            <Form.Error>{errors.password?.message}</Form.Error>
          )}
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label className="flex! items-center gap-2 w-fit">
            <Form.Checkbox ref={rememberMeRef} />
            <span>Remember me</span>
          </Form.Label>
        </Form.Group>
        <Form.Group className="flex flex-col">
          <Button
            el="button"
            type="submit"
            className="py-2 "
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" color="white" />
                <span>Loading...</span>
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </Form.Group>
      </Form>
      <p className="text-center mt-4">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Forgot your password?
        </Link>
      </p>
    </AuthLayout>
  );
}
