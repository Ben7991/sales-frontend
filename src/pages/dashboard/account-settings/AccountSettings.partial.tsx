import { useState } from "react";
import { MdOutlineAlternateEmail, MdOutlineSaveAlt } from "react-icons/md";
import { CgDanger } from "react-icons/cg";
import { LuLock } from "react-icons/lu";
import { TiUserOutline } from "react-icons/ti";
import { RiShieldUserLine } from "react-icons/ri";

import { Button } from "@/components/atoms/button/Button";
import { Form } from "@/components/atoms/form/Form";

function Wrapper(props: { children: React.ReactNode }): React.JSX.Element {
  return <div className="w-full md:w-112.5">{props.children}</div>;
}

export function PersonalInformation(): React.JSX.Element {
  return (
    <Wrapper>
      <Form>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="name">Name</Form.Label>
          <Form.Control
            type="text"
            id="name"
            leftIcon={<TiUserOutline className="text-xl" />}
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            id="username"
            leftIcon={<RiShieldUserLine className="text-xl" />}
          />
        </Form.Group>
        <Form.Group className="mb-8">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            leftIcon={<MdOutlineAlternateEmail className="text-xl" />}
          />
        </Form.Group>
        <Button el="button" type="submit" className="flex! items-center gap-2">
          <MdOutlineSaveAlt className="text-xl" />
          <span>Save changes</span>
        </Button>
      </Form>
    </Wrapper>
  );
}

export function ChangePassword(): React.JSX.Element {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Wrapper>
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
      <Form>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="current_password">Current Password</Form.Label>
          <Form.Control
            type={showCurrentPassword ? "text" : "password"}
            id="current_password"
            placeholder="Type your current password"
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
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label htmlFor="new_password">New Password</Form.Label>
          <Form.Control
            type={showNewPassword ? "text" : "password"}
            id="new_password"
            placeholder="Type your new password"
            leftIcon={<LuLock className="text-xl" />}
            rightIcon={
              <Form.PasswordToggler
                state={showNewPassword}
                onClick={() => setShowNewPassword((prevState) => !prevState)}
              />
            }
          />
        </Form.Group>
        <Form.Group className="mb-8">
          <Form.Label htmlFor="confirm_password">Confirm Password</Form.Label>
          <Form.Control
            type={showConfirmPassword ? "text" : "password"}
            id="confirm_password"
            placeholder="Confirm your new password"
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
        </Form.Group>
        <Button el="button" type="submit" className="flex! items-center gap-1">
          <MdOutlineSaveAlt className="text-xl" />
          <span>Save changes</span>
        </Button>
      </Form>
    </Wrapper>
  );
}
