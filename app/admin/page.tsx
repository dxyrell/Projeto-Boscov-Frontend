"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api, type Movie, type Review, type User } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Users, Film, Star, Edit, Trash2, Plus, Calendar, Clock, UserIcon, Mail, Shield } from "lucide-react"

export default function AdminPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "users"

  const [users, setUsers] = useState<User[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [newUser, setNewUser] = useState<Partial<User & { senha: string }>>({})
  const [newMovie, setNewMovie] = useState<Partial<Movie>>({})
  const [newReview, setNewReview] = useState<Partial<Review>>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [usersData, moviesData, reviewsData] = await Promise.all([
        api.getUsers(),
        api.getMovies(),
        api.getReviews(),
      ])
      setUsers(usersData)
      setMovies(moviesData)
      setReviews(reviewsData)
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        variant: "destructive",
      })
    }
  }

  // User CRUD functions (keeping the same logic)
  const handleCreateUser = async () => {
    try {
      await api.register({
        nome: newUser.nome || "",
        email: newUser.email || "",
        senha: newUser.senha || "",
        tipoUsuario: newUser.tipoUsuario || "user",
        status: newUser.status ?? true,
        apelido: newUser.apelido || "",
        dataNascimento: newUser.dataNascimento || "",
      })
      toast({ title: "Usuário criado com sucesso!" })
      setNewUser({})
      loadData()
    } catch (error) {
      toast({ title: "Erro ao criar usuário", variant: "destructive" })
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return
    try {
      await api.updateUser(editingUser.id, editingUser)
      toast({ title: "Usuário atualizado com sucesso!" })
      setEditingUser(null)
      loadData()
    } catch (error) {
      toast({ title: "Erro ao atualizar usuário", variant: "destructive" })
    }
  }

  const handleDeleteUser = async (id: number) => {
    try {
      await api.deleteUser(id)
      toast({ title: "Usuário excluído com sucesso!" })
      loadData()
    } catch (error) {
      toast({ title: "Erro ao excluir usuário", variant: "destructive" })
    }
  }

  // Movie CRUD functions (keeping the same logic)
  const handleCreateMovie = async () => {
    try {
      await api.createMovie({
        nome: newMovie.nome || "",
        diretor: newMovie.diretor || "",
        anoLancamento: newMovie.anoLancamento || 0,
        duracao: newMovie.duracao || 0,
        produtora: newMovie.produtora || "",
        classificacao: newMovie.classificacao || "",
        poster: newMovie.poster || "",
        generos: newMovie.generos || [],
      })
      toast({ title: "Filme criado com sucesso!" })
      setNewMovie({})
      loadData()
    } catch (error) {
      toast({ title: "Erro ao criar filme", variant: "destructive" })
    }
  }

const handleUpdateMovie = async () => {
  if (!editingMovie) return
  try {
    await api.updateMovie(editingMovie.id, {
      nome: editingMovie.nome || "",
      diretor: editingMovie.diretor || "",
      anoLancamento: editingMovie.anoLancamento || 0,
      duracao: editingMovie.duracao || 0,
      produtora: editingMovie.produtora || "",
      classificacao: editingMovie.classificacao || "",
      poster: editingMovie.poster || "",
      generos: editingMovie.generos || [],
    })
    toast({ title: "Filme atualizado com sucesso!" })
    setEditingMovie(null)
    loadData()
  } catch (error) {
    toast({ title: "Erro ao atualizar filme", variant: "destructive" })
  }
}



  const handleDeleteMovie = async (id: number) => {
    try {
      await api.deleteMovie(id)
      toast({ title: "Filme excluído com sucesso!" })
      loadData()
    } catch (error) {
      toast({ title: "Erro ao excluir filme", variant: "destructive" })
    }
  }

  // Review CRUD functions (keeping the same logic)
  const handleCreateReview = async () => {
    try {
      await api.createReview({
        nota: newReview.nota || 0,
        comentario: newReview.comentario || "",
        idUsuario: newReview.idUsuario || 0,
        idFilme: newReview.idFilme || 0,
      })
      toast({ title: "Avaliação criada com sucesso!" })
      setNewReview({})
      loadData()
    } catch (error) {
      toast({ title: "Erro ao criar avaliação", variant: "destructive" })
    }
  }

  const handleUpdateReview = async () => {
    if (!editingReview) return
    try {
      await api.updateReview(editingReview.idUsuario, editingReview.idFilme, {
        nota: editingReview.nota,
        comentario: editingReview.comentario,
      })
      toast({ title: "Avaliação atualizada com sucesso!" })
      setEditingReview(null)
      loadData()
    } catch (error) {
      toast({ title: "Erro ao atualizar avaliação", variant: "destructive" })
    }
  }

  const handleDeleteReview = async (idUsuario: number, idFilme: number) => {
    try {
      await api.deleteReview(idUsuario, idFilme)
      toast({ title: "Avaliação excluída com sucesso!" })
      loadData()
    } catch (error) {
      toast({ title: "Erro ao excluir avaliação", variant: "destructive" })
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating / 2 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (activeTab === "users") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Usuários</h1>
            <p className="text-muted-foreground">Administre contas de usuários do sistema</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              <Users className="h-4 w-4 mr-1" />
              {users.length} usuários
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Novo Usuário</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input
                  placeholder="Digite o nome completo"
                  value={newUser.nome || ""}
                  onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="usuario@email.com"
                  value={newUser.email || ""}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome de Usuário</Label>
                <Input
                  placeholder="@usuario"
                  value={newUser.apelido || ""}
                  onChange={(e) => setNewUser({ ...newUser, apelido: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Senha</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newUser.senha || ""}
                  onChange={(e) => setNewUser({ ...newUser, senha: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Nascimento</Label>
                <Input
                  type="date"
                  value={newUser.dataNascimento || ""}
                  onChange={(e) => setNewUser({ ...newUser, dataNascimento: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Usuário</Label>
                <Select
                  value={newUser.tipoUsuario}
                  onValueChange={(value: "user" | "admin") => setNewUser({ ...newUser, tipoUsuario: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleCreateUser} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Criar Usuário
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback
                      className={user.tipoUsuario === "admin" ? "bg-red-600 text-white" : "bg-blue-600 text-white"}
                    >
                      {user.nome?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-semibold text-lg">{user.nome}</h3>
                      <p className="text-sm text-muted-foreground">@{user.apelido}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(user.dataNascimento).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={user.tipoUsuario === "admin" ? "default" : "secondary"}>
                        {user.tipoUsuario === "admin" ? (
                          <>
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          <>
                            <UserIcon className="h-3 w-3 mr-1" />
                            Usuário
                          </>
                        )}
                      </Badge>
                      <Badge variant={user.status ? "default" : "destructive"}>
                        {user.status ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingUser(user)} className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Usuário</DialogTitle>
                      </DialogHeader>
                      {editingUser && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Nome</Label>
                            <Input
                              value={editingUser.nome}
                              onChange={(e) => setEditingUser({ ...editingUser, nome: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                              value={editingUser.email}
                              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Apelido</Label>
                            <Input
                              value={editingUser.apelido}
                              onChange={(e) => setEditingUser({ ...editingUser, apelido: e.target.value })}
                            />
                          </div>
                          <Button onClick={handleUpdateUser} className="w-full">
                            Salvar Alterações
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (activeTab === "movies") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Filmes</h1>
            <p className="text-muted-foreground">Administre o catálogo de filmes</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              <Film className="h-4 w-4 mr-1" />
              {movies.length} filmes
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Novo Filme</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título do Filme</Label>
                <Input
                  placeholder="Digite o título"
                  value={newMovie.nome || ""}
                  onChange={(e) => setNewMovie({ ...newMovie, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Diretor</Label>
                <Input
                  placeholder="Nome do diretor"
                  value={newMovie.diretor || ""}
                  onChange={(e) => setNewMovie({ ...newMovie, diretor: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Ano de Lançamento</Label>
                <Input
                  type="number"
                  placeholder="2024"
                  value={newMovie.anoLancamento || ""}
                  onChange={(e) => setNewMovie({ ...newMovie, anoLancamento: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Duração (minutos)</Label>
                <Input
                  type="number"
                  placeholder="120"
                  value={newMovie.duracao || ""}
                  onChange={(e) => setNewMovie({ ...newMovie, duracao: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Classificação</Label>
                <Input
                  placeholder="Livre, 12, 14, 16, 18"
                  value={newMovie.classificacao || ""}
                  onChange={(e) => setNewMovie({ ...newMovie, classificacao: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Produtora</Label>
              <Input
                placeholder="Nome da produtora"
                value={newMovie.produtora || ""}
                onChange={(e) => setNewMovie({ ...newMovie, produtora: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>URL do Poster</Label>
              <Input
                placeholder="https://exemplo.com/poster.jpg"
                value={newMovie.poster || ""}
                onChange={(e) => setNewMovie({ ...newMovie, poster: e.target.value })}
              />
            </div>
            <Button onClick={handleCreateMovie} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Filme
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[2/3] relative">
                <img
                  src={movie.poster || "/placeholder.svg?height=400&width=300"}
                  alt={movie.nome}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/70 text-white">
                    {movie.classificacao}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{movie.nome}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4" />
                    <span className="truncate">{movie.diretor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{movie.anoLancamento}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{movie.duracao}min</span>
                    </div>
                  </div>
                  <p className="text-xs truncate">{movie.produtora}</p>
                </div>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingMovie(movie)} className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Filme</DialogTitle>
                      </DialogHeader>
                      {editingMovie && (
                      <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Título do Filme</Label>
        <Input
          value={editingMovie.nome}
          onChange={(e) => setEditingMovie({ ...editingMovie, nome: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Diretor</Label>
        <Input
          value={editingMovie.diretor}
          onChange={(e) => setEditingMovie({ ...editingMovie, diretor: e.target.value })}
        />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Ano de Lançamento</Label>
        <Input
          type="number"
          value={editingMovie.anoLancamento}
          onChange={(e) =>
            setEditingMovie({ ...editingMovie, anoLancamento: Number.parseInt(e.target.value) })
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Duração (minutos)</Label>
        <Input
          type="number"
          value={editingMovie.duracao}
          onChange={(e) =>
            setEditingMovie({ ...editingMovie, duracao: Number.parseInt(e.target.value) })
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Classificação</Label>
        <Input
          value={editingMovie.classificacao}
          onChange={(e) => setEditingMovie({ ...editingMovie, classificacao: e.target.value })}
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label>Produtora</Label>
      <Input
        value={editingMovie.produtora}
        onChange={(e) => setEditingMovie({ ...editingMovie, produtora: e.target.value })}
      />
    </div>
    <div className="space-y-2">
      <Label>URL do Poster</Label>
      <Input
        value={editingMovie.poster}
        onChange={(e) => setEditingMovie({ ...editingMovie, poster: e.target.value })}
      />
    </div>

    <Button onClick={handleUpdateMovie} className="w-full">
      Salvar Alterações
    </Button>
                      </div>
                      )}

                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteMovie(movie.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (activeTab === "reviews") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Avaliações</h1>
            <p className="text-muted-foreground">Administre todas as avaliações do sistema</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              <Star className="h-4 w-4 mr-1" />
              {reviews.length} avaliações
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Nova Avaliação</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Usuário</Label>
                <select
                  className="w-full p-3 border rounded-lg bg-background"
                  value={newReview.idUsuario || ""}
                  onChange={(e) => setNewReview({ ...newReview, idUsuario: Number.parseInt(e.target.value) })}
                >
                  <option value="">Selecione um usuário</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.nome} (@{user.apelido})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Filme</Label>
                <select
                  className="w-full p-3 border rounded-lg bg-background"
                  value={newReview.idFilme || ""}
                  onChange={(e) => setNewReview({ ...newReview, idFilme: Number.parseInt(e.target.value) })}
                >
                  <option value="">Selecione um filme</option>
                  {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.nome} ({movie.anoLancamento})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nota (1-10)</Label>
              <Input
                type="number"
                min="1"
                max="10"
                placeholder="8"
                value={newReview.nota || ""}
                onChange={(e) => setNewReview({ ...newReview, nota: Number.parseInt(e.target.value) })}
                className="text-center text-lg font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label>Comentário</Label>
              <Textarea
                placeholder="Escreva a avaliação..."
                value={newReview.comentario || ""}
                onChange={(e) => setNewReview({ ...newReview, comentario: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={handleCreateReview} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Criar Avaliação
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reviews.map((review) => {
            const user = users.find((u) => u.id === review.idUsuario)
            const movie = movies.find((m) => m.id === review.idFilme)
            return (
              <Card key={`${review.idUsuario}-${review.idFilme}`} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={movie?.poster || "/placeholder.svg?height=96&width=64"}
                        alt={movie?.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{movie?.nome || `Filme #${review.idFilme}`}</h3>
                        <p className="text-sm text-muted-foreground">
                          por {user?.nome || `Usuário #${review.idUsuario}`} (@{user?.apelido})
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.nota)}
                        <span className="ml-2 text-sm font-medium">{review.nota}/10</span>
                      </div>
                      <p className="text-sm leading-relaxed">{review.comentario}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingReview(review)} className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Avaliação</DialogTitle>
                        </DialogHeader>
                        {editingReview && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Nota (1-10)</Label>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={editingReview.nota}
                                onChange={(e) =>
                                  setEditingReview({ ...editingReview, nota: Number.parseInt(e.target.value) })
                                }
                                className="text-center text-lg font-semibold"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Comentário</Label>
                              <Textarea
                                value={editingReview.comentario}
                                onChange={(e) => setEditingReview({ ...editingReview, comentario: e.target.value })}
                                className="min-h-[100px]"
                              />
                            </div>
                            <Button onClick={handleUpdateReview} className="w-full">
                              Salvar Alterações
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteReview(review.idUsuario, review.idFilme)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}
