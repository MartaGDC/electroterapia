import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createUsers, deleteUsers, getAllUsers } from "../api/user";
import { Roles } from "../constants/interfaces";

type User = {
  _id: string;
  name: string;
  role: Roles.ALUMNO | Roles.PROFESOR;
}

type SelectedUsersMap = {
  [userId: string]: boolean;
};

type UserListContextType = {
  users: User[];
  selected: SelectedUsersMap;
  numProfesores: number;
  addUsers: (usersParam: {name: string, password: string, role: string}[]) => Promise<any[]>;
  eliminateUsers: (usersId: string[]) => Promise<void>;
  getUsers: () => Promise<void>;
  selectUser: (selectedId: string, select: boolean) => void;
  selectAllUsers: (select: boolean) => void;
  deleteSelectedUsers: () => Promise<void>;
  search: (event: Event) => void;
};

const UserListContext = createContext<UserListContextType | null>(null);

export const useUserList = () => {
  const context = useContext(UserListContext);
  if (!context) throw new Error("useUserList must be used within UserListProvider");
  else return context;
};

export const UserListProvider = (props: any) => {
  // Almacena el valor de todos los usuarios
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  // Almacena la lista de usuarios visibles dado el input actual en la barra de búsqueda de usuarios
  const [users, setUsers] = useState<User[]>([]);

  // Array de longitud = allUsers.length. Cada componente se corresponde con cada usuario de allUsers, si la componente es false no está seleccionado, si es true, si lo está
  const [selected, setSelected] = useState<SelectedUsersMap>({});
  
  // Número de profesores en la lista. Sirve para controlar el selectAll de modo que no seleccione a los profesores
  const numProfesores = useRef(0);

  // Crea nuevos usuarios y devuelve aquellos que no fueron creados
  const addUsers = async (
    usersParam: {name: string, password: string, role: string}[]
  ): Promise<any[]> => {
    const res = await createUsers({ users: usersParam});

    if (res.status === 200) {
      const newUsersArray: User[] = [...allUsers, ...res.data.usersCreated].sort((a, b) => {
        if (a.role === Roles.PROFESOR && b.role === Roles.ALUMNO) return -1;
        if (a.role === Roles.ALUMNO && b.role === Roles.PROFESOR) return 1;
        return 0; // si son iguales, no cambia el orden
      });
            
      res.data.usersCreated.map((user: User) => {
        if (user.role == Roles.PROFESOR) numProfesores.current += 1;
      });

      setAllUsers(newUsersArray);
      setUsers(newUsersArray);

      setSelected(
        newUsersArray.reduce<SelectedUsersMap>((acc, user) => {
          acc[user._id] = false;
          return acc;
        }, {})
      );

      return res.data.usersNotCreated;
    } else {
      return usersParam;
    }
  }

  // Elimina usuarios
  const eliminateUsers = async (usersId: string[]) => {
    const res = await deleteUsers({ users: usersId });

    if (res.status === 200) {
      const newUsersArray = allUsers.filter((user, _) => {
        let eliminar = usersId.includes(user._id);
        if (eliminar && user.role == Roles.PROFESOR) numProfesores.current -= 1;
        return eliminar;
      })

      setAllUsers(newUsersArray);
      setUsers(newUsersArray);
    }
  }

  // Llama a la API para obtener la lista de alumnos
  const getUsers = async () => {
    const res = await getAllUsers();
    numProfesores.current = 0;
    if (res.status == 200) {
      const newUsersArray: User[] = res.data.users.map((user: User) => {
        if (user.role == Roles.PROFESOR) numProfesores.current += 1;
        return { ...user };
      })

      setAllUsers(newUsersArray);
      setUsers(newUsersArray);

      setSelected(
        newUsersArray.reduce<SelectedUsersMap>((acc, user) => {
          acc[user._id] = false;
          return acc;
        }, {})
      );
    }
  }

  // Selecciona una serie de usuarios dado sus ids
  const selectUser = (selectedId: string, select: boolean) => {
    selected[selectedId] = select;
  };

  const selectAllUsers = (select: boolean) => {
    allUsers.map((user) => { 
      if (user.role == Roles.ALUMNO) selected[user._id] = select; 
    })
  }

  const deleteSelectedUsers = async () => {
    const usersToDelete = allUsers
      .filter((user, idx) => selected[user._id])
      .map(user => user._id);
    
    if (usersToDelete.length == 0) return;

    const res = await deleteUsers({ users: usersToDelete });

    if (res.status == 200) {
      const newUsersArray = allUsers.filter((user) => !usersToDelete.includes(user._id));

      setAllUsers(newUsersArray);
      setUsers(newUsersArray)
      setSelected(
        newUsersArray.reduce<SelectedUsersMap>((acc, user) => {
          acc[user._id] = false;
          return acc;
        }, {})
      );

    } else {
      console.log(res.data.message)
    }
  }

  const search = (event: Event) => {
    let query = '';
    const target = event.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();

    setUsers(allUsers.filter((d) => d.name.toLowerCase().indexOf(query) > -1));
  };

  return (
    <UserListContext.Provider
      value={{
        users,
        selected,
        numProfesores: numProfesores.current,
        addUsers,
        eliminateUsers,
        getUsers,
        selectUser,
        selectAllUsers,
        deleteSelectedUsers,
        search
      }}
    >
      {props.children}
    </UserListContext.Provider>  
  )
}