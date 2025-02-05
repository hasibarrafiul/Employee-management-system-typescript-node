import { RequestHandler } from "express";
import { UserRepositoryMySQL } from "../repositories/userRepositoryMySQL";
import { User } from "../entities/User";
import { UserDetails } from "../entities/UserDetails";


const userRepository = new UserRepositoryMySQL();

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      kana: user.kana,
      birthDate: user.userDetails?.birth || null,
      club: user.userDetails?.club || null,
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const checkUserExistence: RequestHandler = async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    res.status(400).json({ success: false, message: "ユーザーIDとパスワードを入力してください。" });
    return;
  }

  try {
    const user = await userRepository.findUserByCredentials(userId, password);

    if (user) {
      res.json({ success: true, message: "ユーザーが見つかりました。" });
    } else {
      res.status(404).json({ success: false, message: "ユーザーIDまたはパスワードが間違っています。" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "サーバーエラーが発生しました。" });
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userRepository.findUserById(id);

    if (!user) {
      res.status(404).json({ success: false, message: "ユーザーが見つかりませんでした。" });
      return;
    }

    await userRepository.deleteUser(user);
    res.json({ success: true, message: "ユーザーが正常に削除されました。" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "サーバーエラーが発生しました。" });
  }
};

export const checkUsernameAvailability: RequestHandler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ success: false, message: "ユーザーIDを入力してください。" });
    return;
  }

  try {
    const user = await userRepository.findUserById(id as string);

    if (user) {
      res.json({ success: false, message: "IDが使用できません。" });
    } else {
      res.json({ success: true, message: "IDが使用可能です。" });
    }
  } catch (error) {
    console.error("Error checking username availability:", error);
    res.status(500).json({ success: false, message: "サーバーエラーが発生しました。" });
  }
};

export const upsertUser: RequestHandler = async (req, res) => {
  const { id, name, kana, password, birthDate, club } = req.body;

  if (!id || !name) {
    res.status(400).json({ success: false, message: "必須フィールドが不足しています。" });
    return;
  }

  try {
    const existingUser = await userRepository.findUserById(id);

    if (existingUser) {
      existingUser.name = name;
      existingUser.kana = kana;
      if (password) {
        existingUser.password = password;
      }

      if (existingUser.userDetails) {
        existingUser.userDetails.birth = birthDate;
        existingUser.userDetails.club = club;
        await userRepository.updateUserDetails(existingUser.userDetails);
      } else {
        const newUserDetails = new UserDetails();
        newUserDetails.id = id;
        newUserDetails.birth = birthDate;
        newUserDetails.club = club;

        await userRepository.updateUserDetails(newUserDetails);
        existingUser.userDetails = newUserDetails;
      }

      await userRepository.updateUser(existingUser);
      res.json({ success: true, message: "ユーザーが正常に更新されました。" });
    } else {
      const newUser = new User();
      newUser.id = id;
      newUser.name = name;
      newUser.kana = kana;
      newUser.password = password;

      const newUserDetails = new UserDetails();
      newUserDetails.id = id;
      newUserDetails.birth = birthDate;
      newUserDetails.club = club;
      newUser.userDetails = newUserDetails;

      await userRepository.createUser(newUser);
      res.json({ success: true, message: "ユーザーが正常に作成されました。" });
    }
  } catch (error) {
    console.error("Error upserting user:", error);
    res.status(500).json({ success: false, message: "サーバーエラーが発生しました。" });
  }
};




