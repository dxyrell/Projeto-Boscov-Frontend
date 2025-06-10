"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { api, type Movie, type Review, type User } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Edit, Trash2, Plus, Star, Calendar, Clock, UserIcon } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "profile"

  const [movies, setMovies] = useState<Movie[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [userReviews, setUserReviews] = useState<Review[]>([])
  const [profileData, setProfileData] = useState<Partial<User>>({})
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [reviewForm, setReviewForm] = useState({ nota: 5, comentario: "", idFilme: 0 })
  const [editingReview, setEditingReview] = useState<Review | null>(null)

  useEffect(() => {
    if (user) {
      setProfileData(user)
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      const [moviesData, reviewsData] = await Promise.all([api.getMovies(), api.getReviews()])
      setMovies(moviesData)
      setReviews(reviewsData)
      setUserReviews(reviewsData.filter((r) => r.idUsuario === user?.id))
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        variant: "destructive",
      })
    }
  }

  const handleProfileUpdate = async () => {
    if (!user) return

    try {
      await api.updateUser(user.id, profileData)
      toast({
        title: "Perfil atualizado com sucesso!",
      })
      setIsEditingProfile(false)
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        variant: "destructive",
      })
    }
  }

  const handleCreateReview = async () => {
    if (!user) return

    try {
      await api.createReview({
        ...reviewForm,
        idUsuario: user.id,
      })
      toast({
        title: "Avaliação criada com sucesso!",
      })
      setReviewForm({ nota: 5, comentario: "", idFilme: 0 })
      loadData()
    } catch (error) {
      toast({
        title: "Erro ao criar avaliação",
        variant: "destructive",
      })
    }
  }

  const handleUpdateReview = async () => {
    if (!user || !editingReview) return

    try {
      await api.updateReview(user.id, editingReview.idFilme, {
        nota: editingReview.nota,
        comentario: editingReview.comentario,
      })
      toast({
        title: "Avaliação atualizada com sucesso!",
      })
      setEditingReview(null)
      loadData()
    } catch (error) {
      toast({
        title: "Erro ao atualizar avaliação",
        variant: "destructive",
      })
    }
  }

  const handleDeleteReview = async (idFilme: number) => {
    if (!user) return

    try {
      await api.deleteReview(user.id, idFilme)
      toast({
        title: "Avaliação excluída com sucesso!",
      })
      loadData()
    } catch (error) {
      toast({
        title: "Erro ao excluir avaliação",
        variant: "destructive",
      })
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating / 2 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (activeTab === "profile") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-2xl">{user?.nome?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user?.nome}</CardTitle>
                <p className="text-muted-foreground">@{user?.apelido}</p>
                <Badge variant={user?.tipoUsuario === "admin" ? "default" : "secondary"} className="mt-2">
                  {user?.tipoUsuario === "admin" ? "Administrador" : "Usuário"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditingProfile ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={profileData.nome || ""}
                      onChange={(e) => setProfileData({ ...profileData, nome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apelido">Nome de Usuário</Label>
                    <Input
                      id="apelido"
                      value={profileData.apelido || ""}
                      onChange={(e) => setProfileData({ ...profileData, apelido: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email || ""}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={profileData.dataNascimento || ""}
                    onChange={(e) => setProfileData({ ...profileData, dataNascimento: e.target.value })}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleProfileUpdate}>Salvar Alterações</Button>
                  <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                    Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Nome Completo</Label>
                        <p className="text-sm text-muted-foreground">{user?.nome}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Data de Nascimento</Label>
                        <p className="text-sm text-muted-foreground">
                          {user?.dataNascimento
                            ? new Date(user.dataNascimento).toLocaleDateString("pt-BR")
                            : "Não informado"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Avaliações</Label>
                        <p className="text-sm text-muted-foreground">{userReviews.length} avaliações feitas</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button onClick={() => setIsEditingProfile(true)} className="w-full md:w-auto">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (activeTab === "movies") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo de Filmes</h1>
          <p className="text-muted-foreground">Explore nossa coleção de filmes</p>
        </div>

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
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{movie.nome}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4" />
                    <span>{movie.diretor}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{movie.anoLancamento}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{movie.duracao}min</span>
                    </div>
                  </div>
                  <p className="text-xs">{movie.produtora}</p>
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Todas as Avaliações</h1>
          <p className="text-muted-foreground">Veja o que outros usuários estão dizendo</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reviews.map((review) => {
            const movie = movies.find((m) => m.id === review.idFilme)
            return (
              <Card key={`${review.idUsuario}-${review.idFilme}`} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>U{review.idUsuario}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Usuário #{review.idUsuario}</p>
                          <p className="text-sm text-muted-foreground">{movie?.nome || `Filme #${review.idFilme}`}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.nota)}
                          <span className="ml-2 text-sm font-medium">{review.nota}/10</span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">{review.comentario}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  if (activeTab === "my-reviews") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Avaliações</h1>
          <p className="text-muted-foreground">Gerencie suas avaliações de filmes</p>
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
                <Label htmlFor="filme">Selecionar Filme</Label>
                <select
                  className="w-full p-3 border rounded-lg bg-background"
                  value={reviewForm.idFilme}
                  onChange={(e) => setReviewForm({ ...reviewForm, idFilme: Number.parseInt(e.target.value) })}
                >
                  <option value={0}>Escolha um filme...</option>
                  {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.nome} ({movie.anoLancamento})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nota">Nota (1-10)</Label>
                <Input
                  id="nota"
                  type="number"
                  min="1"
                  max="10"
                  value={reviewForm.nota}
                  onChange={(e) => setReviewForm({ ...reviewForm, nota: Number.parseInt(e.target.value) })}
                  className="text-center text-lg font-semibold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comentario">Sua Avaliação</Label>
              <Textarea
                id="comentario"
                placeholder="Compartilhe sua opinião sobre o filme..."
                value={reviewForm.comentario}
                onChange={(e) => setReviewForm({ ...reviewForm, comentario: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={handleCreateReview} disabled={!reviewForm.idFilme} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Publicar Avaliação
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {userReviews.map((review) => {
            const movie = movies.find((m) => m.id === review.idFilme)
            return (
              <Card key={`${review.idUsuario}-${review.idFilme}`} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-16 h-24 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={movie?.poster || "/placeholder.svg?height=96&width=64"}
                          alt={movie?.nome}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">{movie?.nome || `Filme #${review.idFilme}`}</h3>
                          <div className="flex items-center space-x-1 mt-1">
                            {renderStars(review.nota)}
                            <span className="ml-2 text-sm font-medium">{review.nota}/10</span>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{review.comentario}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingReview(review)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Avaliação</DialogTitle>
                          </DialogHeader>
                          {editingReview && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-nota">Nota (1-10)</Label>
                                <Input
                                  id="edit-nota"
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
                                <Label htmlFor="edit-comentario">Comentário</Label>
                                <Textarea
                                  id="edit-comentario"
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
                      <Button variant="outline" size="sm" onClick={() => handleDeleteReview(review.idFilme)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
