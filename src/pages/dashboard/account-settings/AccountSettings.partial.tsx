import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { MdOutlineAlternateEmail, MdOutlineSaveAlt } from "react-icons/md";
import { CgDanger } from "react-icons/cg";
import { LuLock } from "react-icons/lu";
import { RiShieldUserLine, RiUser4Line, RiUser5Line } from "react-icons/ri";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/atoms/button/Button";
import { Form } from "@/components/atoms/form/Form";
import {
  personalInformationSchema,
  changePersonalInformation,
  passwordSchema,
  changePassword,
} from "./AccountSettings.utils";
import type {
  ChangePasswordInputs,
  PersonalInformationInputs,
} from "./AccountSettings.types";
import { useAppDispatch } from "@/store/index.util";
import { removeAuthUser, setAuthUser } from "@/store/slice/auth/auth.slice";
import { Alert } from "@/components/molecules/alert/Alert";
import { useAlert } from "@/components/molecules/alert/Alert.hooks";
import { logout } from "@/components/layouts/dashboard/Dashboard.utils";

function Wrapper(props: { children: React.ReactNode }): React.JSX.Element {
  return <div className="w-full md:w-112.5">{props.children}</div>;
}

export function PersonalInformation(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { state, alertDetails, showAlert, hideAlert, setAlertDetails } =
    useAlert();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonalInformationInputs>({
    mode: "onBlur",
    resolver: yupResolver(personalInformationSchema),
  });

  const onSubmit: SubmitHandler<PersonalInformationInputs> = async (
    data,
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await changePersonalInformation({
        username: data.username,
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
      });
      dispatch(setAuthUser({ user: result.data }));
      setAlertDetails({
        message: result.message,
        variant: "success",
      });
      reset();
    } catch (error) {
      setAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
      console.error("Failed to change personal information", error);
    } finally {
      setIsLoading(false);
      showAlert();
    }
  };

  return (
    <Wrapper>
      {state ? (
        <Alert
          variant={alertDetails?.variant ?? "error"}
          message={alertDetails?.message ?? ""}
          onHide={hideAlert}
        />
      ) : null}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="first_name">First Name</Form.Label>
          <Form.Control
            type="text"
            id="first_name"
            placeholder="Enter your first name"
            leftIcon={<RiUser4Line className="text-xl" />}
            {...register("firstName")}
            hasError={Boolean(errors.firstName)}
          />
          {Boolean(errors.firstName) && (
            <Form.Error>{errors.firstName?.message}</Form.Error>
          )}
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="last_name">Last Name</Form.Label>
          <Form.Control
            type="text"
            id="last_name"
            placeholder="Enter your last name"
            leftIcon={<RiUser5Line className="text-xl" />}
            {...register("lastName")}
            hasError={Boolean(errors.lastName)}
          />
          {Boolean(errors.lastName) && (
            <Form.Error>{errors.lastName?.message}</Form.Error>
          )}
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            id="username"
            placeholder="Enter your username"
            leftIcon={<RiShieldUserLine className="text-xl" />}
            {...register("username")}
            hasError={Boolean(errors.username)}
          />
          {Boolean(errors.username) && (
            <Form.Error>{errors.username?.message}</Form.Error>
          )}
        </Form.Group>
        <Form.Group className="mb-8">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            placeholder="Enter your email"
            leftIcon={<MdOutlineAlternateEmail className="text-xl" />}
            {...register("email")}
            hasError={Boolean(errors.email)}
          />
          {Boolean(errors.email) && (
            <Form.Error>{errors.email?.message}</Form.Error>
          )}
        </Form.Group>
        <Button
          el="button"
          type="submit"
          className="flex! items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Button.Loader />
          ) : (
            <>
              <MdOutlineSaveAlt className="text-xl" />
              <span>Save changes</span>
            </>
          )}
        </Button>
      </Form>
    </Wrapper>
  );
}

export function ChangePassword(): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordInputs>({
    mode: "onBlur",
    resolver: yupResolver(passwordSchema),
  });
  const { state, alertDetails, showAlert, hideAlert, setAlertDetails } =
    useAlert();

  const onSubmit: SubmitHandler<ChangePasswordInputs> = async (
    data,
  ): Promise<void> => {
    setIsLoading(true);

    try {
      const result = await changePassword(data);
      setAlertDetails({
        message: result.message,
        variant: "success",
      });
      reset();
      await logout();
      dispatch(removeAuthUser());
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      setAlertDetails({
        message: (error as Error).message,
        variant: "error",
      });
      console.error("Failed to change password", error);
    } finally {
      showAlert();
    }
  };

  return (
    <Wrapper>
      {state ? (
        <Alert
          variant={alertDetails?.variant ?? "error"}
          message={alertDetails?.message ?? ""}
          onHide={hideAlert}
        />
      ) : null}
      <div className="mb-5 p-4 rounded-sm bg-red-100 text-red-600 flex gap-2 items-start">
        <div className="basis-12">
          <CgDanger className="text-3xl" />
        </div>
        <p>
          Please note that when the form is submitted and is successfully, the
          system will log you out and redirect you to the login page to try
          logging in with your new password
        </p>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="current_password">Current Password</Form.Label>
          <Form.Control
            type={showCurrentPassword ? "text" : "password"}
            id="current_password"
            placeholder="Type your current password"
            {...register("currentPassword")}
            hasError={Boolean(errors.currentPassword)}
            leftIcon={<LuLock className="text-xl" />}
            rightIcon={
              <Form.PasswordToggler
                state={showCurrentPassword}
                onClick={() =>
                  setShowCurrentPassword((prevState) => !prevState)
                }
              />
            }
          />
          {Boolean(errors.currentPassword) && (
            <Form.Error>{errors.currentPassword?.message}</Form.Error>
          )}
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="new_password">New Password</Form.Label>
          <Form.Control
            type={showNewPassword ? "text" : "password"}
            id="new_password"
            placeholder="Type your new password"
            {...register("newPassword")}
            hasError={Boolean(errors.newPassword)}
            leftIcon={<LuLock className="text-xl" />}
            rightIcon={
              <Form.PasswordToggler
                state={showNewPassword}
                onClick={() => setShowNewPassword((prevState) => !prevState)}
              />
            }
          />
          {Boolean(errors.newPassword) && (
            <Form.Error>{errors.newPassword?.message}</Form.Error>
          )}
        </Form.Group>
        <Form.Group className="mb-8">
          <Form.Label htmlFor="confirm_password">Confirm Password</Form.Label>
          <Form.Control
            type={showConfirmPassword ? "text" : "password"}
            id="confirm_password"
            placeholder="Confirm your new password"
            {...register("confirmPassword")}
            hasError={Boolean(errors.confirmPassword)}
            leftIcon={<LuLock className="text-xl" />}
            rightIcon={
              <Form.PasswordToggler
                state={showConfirmPassword}
                onClick={() =>
                  setShowConfirmPassword((prevState) => !prevState)
                }
              />
            }
          />
          {Boolean(errors.confirmPassword) && (
            <Form.Error>{errors.confirmPassword?.message}</Form.Error>
          )}
        </Form.Group>
        <Button
          el="button"
          type="submit"
          className="flex! items-center gap-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <Button.Loader />
          ) : (
            <>
              <MdOutlineSaveAlt className="text-xl" />
              <span>Save changes</span>
            </>
          )}
        </Button>
      </Form>
    </Wrapper>
  );
}
