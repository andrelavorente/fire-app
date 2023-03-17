import { useState, useEffect } from "react";
import { db, auth } from "./firebaseConnection";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import "./app.css";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(listaPost);
      });
    }
    loadPosts();
  }, []);

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          //se tem usuário logado ele entra aqui
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email,
          });
        } else {
          //não possui nenhum user logado
          setUser(false);
          setUserDetail({});
        }
      });
    }
    checkLogin();
  }, []);

  async function handleAdd() {
    // await setDoc(doc(db, "posts", "12345"), {
    //   titulo: titulo,
    //   autor: autor,
    // })
    //   .then(() => {
    //     console.log("Dados registrados no campo!");
    //   })
    //   .catch((error) => {
    //     console.log(`Gerou o erro ${error}`);
    //   });

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("Cadastrado com sucesso!");
        setAutor("");
        setTitulo("");
      })
      .catch((error) => {
        console.log(`Gerou o erro ${error}`);
      });
  }

  async function buscarPosts() {
    // const postRef = doc(db, "posts", "oRdfVkeR8WsXfhX7CY5b");
    // await getDoc(postRef)
    //   .then((snapshot) => {
    //     setAutor(snapshot.data().autor);
    //     setTitulo(snapshot.data().titulo);
    //   })
    //   .catch((erro) => {
    //     console.log("ERRO AO BUSCAR");
    //   });

    const postsRef = collection(db, "posts");
    await getDocs(postsRef)
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });

          setPosts(lista);
        });
      })
      .catch((error) => {
        console.log(`Erro ao buscar. Erro: ${error}`);
      });
  }

  async function editarPost() {
    const docRef = doc(db, "posts", idPost);

    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("POST ATUALIZADO");
        setIdPost("");
        setTitulo("");
        setAutor("");
      })
      .catch(() => {
        console.log("Erro ao atualizar o post");
      });
  }

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef)
      .then(() => {
        alert("Post deletado com sucesso!");
      })
      .catch((error) => {
        console.log(`Erro: ${error}`);
      });
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        alert("Usuário cadastrado com sucesso!");
        console.log(value);
        setEmail("");
        setSenha("");
      })
      .catch((erro) => {
        if (erro.code === "auth/weak-password") {
          alert("Senha muito fraca");
        } else if (erro.code === "auth/email-already-in-use") {
          alert("Email já cadastrado!");
        }
      });
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("USER LOGADO COM SUCESSO!");
        console.log(value.user);

        setUserDetail({
          uid: value.user.uid,
          email: value.user.email,
        });
        setUser(true);

        setEmail("");
        setSenha("");
      })
      .catch((error) => {
        alert(`Erro ao efetuar o login: ${error}`);
      });
  }

  async function fazerLogout() {
    await signOut(auth);
    setUser(false);
    setUserDetail({});
  }
  return (
    <div>
      <h1>React JS+FireBase</h1>

      {user == true && (
        <div>
          <strong>Seja bem-vindo(a)! (Você está logado)</strong>
          <br />
          <br />
          <span>
            ID: {userDetail.uid} - email: {userDetail.email}
          </span>
          <br />
          <button onClick={fazerLogout}>Sair da Conta</button>

          <br />
          <br />
        </div>
      )}

      <div className="container">
        <h2>Usuários</h2>
        <label htmlFor="">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite o email"
        />{" "}
        <br />
        <label htmlFor="">Senha</label>
        <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite a senha"
        />{" "}
        <br />
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Fazer Login</button>
      </div>
      <br />
      <hr />
      <br />

      <h2>Posts</h2>
      <div className="container">
        <label htmlFor="">ID do Post:</label>
        <input
          type="text"
          placeholder="Digite o ID do post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />
        <br />

        <label htmlFor="">Título</label>
        <textarea
          type="text"
          placeholder="Digite o título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <label htmlFor="">Autor:</label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPosts}>Buscar posts</button>
        <br />

        <button onClick={editarPost}>Atualizar Post</button>
        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <strong>ID: {post.id}</strong>
                <br />
                <span>Titulo: {post.titulo} </span> <br />
                <span>Autor: {post.autor} </span> <br />
                <button onClick={() => excluirPost(post.id)}>Excluir</button>
                <br />
                <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
