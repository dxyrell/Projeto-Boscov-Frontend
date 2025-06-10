const API_BASE_URL = "http://localhost:3000"

export interface User {
  id: number
  nome: string
  email: string
  tipoUsuario: "user" | "admin"
  status: boolean
  apelido: string
  dataNascimento: string
}

export interface Movie {
  id: number
  nome: string
  diretor: string
  anoLancamento: number
  duracao: number
  produtora: string
  classificacao: string
  poster: string
  generos: number[]
}

export interface Review {
  idUsuario: number
  idFilme: number
  nota: number
  comentario: string
  usuario?: User
  filme?: Movie
}

export interface LoginResponse {
  token: string
  user: User
}

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  // Auth
  async login(email: string, senha: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    })
    if (!response.ok) throw new Error("Login failed")
    return response.json()
  }

  async register(userData: Omit<User, "id"> & { senha: string }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    if (!response.ok) throw new Error("Registration failed")
    return response.json()
  }

  // Users
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch users")
    return response.json()
  }

  async getUser(id: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch user")
    return response.json()
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    })
    if (!response.ok) throw new Error("Failed to update user")
    return response.json()
  }

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to delete user")
  }

  // Movies
  async getMovies(): Promise<Movie[]> {
    const response = await fetch(`${API_BASE_URL}/movies`)
    if (!response.ok) throw new Error("Failed to fetch movies")
    return response.json()
  }

  async getMovie(id: number): Promise<Movie> {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`)
    if (!response.ok) throw new Error("Failed to fetch movie")
    return response.json()
  }

  async createMovie(movieData: Omit<Movie, "id">): Promise<Movie> {
    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(movieData),
    })
    if (!response.ok) throw new Error("Failed to create movie")
    return response.json()
  }

  async updateMovie(id: number, movieData: Partial<Movie>): Promise<Movie> {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(movieData),
    })
    if (!response.ok) throw new Error("Failed to update movie")
    return response.json()
  }

  async deleteMovie(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to delete movie")
  }

  // Reviews
  async getReviews(): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/reviews`)
    if (!response.ok) throw new Error("Failed to fetch reviews")
    return response.json()
  }

  async getReview(idUsuario: number, idFilme: number): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/reviews/${idUsuario}/${idFilme}`)
    if (!response.ok) throw new Error("Failed to fetch review")
    return response.json()
  }

  async createReview(reviewData: Review): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reviewData),
    })
    if (!response.ok) throw new Error("Failed to create review")
    return response.json()
  }

  async updateReview(idUsuario: number, idFilme: number, reviewData: Partial<Review>): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/reviews/${idUsuario}/${idFilme}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reviewData),
    })
    if (!response.ok) throw new Error("Failed to update review")
    return response.json()
  }

  async deleteReview(idUsuario: number, idFilme: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/reviews/${idUsuario}/${idFilme}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to delete review")
  }
}

export const api = new ApiClient()
