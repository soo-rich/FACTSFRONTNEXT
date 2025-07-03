'use client';

import { Button } from '@/components/ui/button';
import CircularProgress from '@/components/ui/circularprogess';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, PasswordInput } from '@/components/ui/input';
import { UserService } from '@/service/user/user.service';
import { userCreateSchema, userUpdateSchema, UtilisateurDto, UtilisateurUpdate, UtilsateurRegister } from '@/types/utilisateur.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type UserFormProps = {
  edit?: boolean;
  user?: UtilisateurDto;
}

const UserForm = ({ user, edit }: UserFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<UtilsateurRegister>({
    resolver: zodResolver(userCreateSchema),
    mode: 'onChange',
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      numero: '',
      username: '',
      password: '',
    },
  });
  const formupdate = useForm<UtilisateurUpdate>({
    resolver: zodResolver(userUpdateSchema),
    mode: 'onChange',
    defaultValues: {
      ...user,
      numero: String(user?.telephone) ?? ''
    },
  });


  const UserAddMutation = useMutation({
    mutationFn: async (data: UtilsateurRegister) => {
      return await UserService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [UserService.USER_KEY],
      });
      toast.success('Utilisateur ajoute', {
        duration: 3000,
      });
    },
    onError: () => {
      toast.error('Erreur l\'ajout', {
        duration: 3000,
      });
    },
  });

  const UserEditMutation = useMutation({
    mutationFn: async (data: UtilisateurUpdate) => {
      if (user?.id) {
        return await UserService.update({
          id: user?.id, user: data,
        });
      }

    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [UserService.USER_KEY],
      });
      toast.success(`Utilisateur ${data?.nom} mis ajour`, {
        duration: 3000,
      });
    },
    onError: () => {
      toast.error('Erreur la mise a jour', {
        duration: 3000,
      });
    },
  });

  const Submit: SubmitHandler<UtilsateurRegister> = (data: UtilsateurRegister) => {
    return UserAddMutation.mutate(data);
  };

  const SubmitUpdate: SubmitHandler<UtilisateurUpdate> = (data: UtilisateurUpdate) => {
    return UserEditMutation.mutate(data);
  };


  return (
    !edit ?
      (<Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(Submit)} className={'grid grid-cols-1 gap-3'}>
          <div className={'flex flex-col gap-3'}>
            <div className={'grid grid-cols-2 gap-3'}>
              <FormField control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className={'text-red-600'} />
                </FormItem>
              )} name={'nom'} />
              <FormField control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Prenom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className={'text-red-600'} />
                </FormItem>
              )} name={'prenom'} />

              <FormField control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type={'email'} {...field} />
                  </FormControl>
                  <FormMessage className={'text-red-600'} />
                </FormItem>
              )} name={'email'} />

              <FormField control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className={'text-red-600'} />
                </FormItem>
              )} name={'numero'} />



            </div>
            <div className={'grid grid-cols-1 gap-2'}>
              <FormField control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className={'text-red-600'} />
                </FormItem>
              )} name={'username'} />
              <FormField control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>mot de passe</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage className={'text-red-600'} />
                </FormItem>
              )} name={'password'} />
            </div>
          </div>

          <div className={'flex flex-row gap-2 justify-center items-center align-middle'}>
            {UserAddMutation.isPending
              ? (<>
                <CircularProgress size={40} strokeWidth={2} className={'text-primary'} />
              </>)
              : (
                <>
                  <Button variant={'ghost'} type={'button'}
                    onClick={() => form.reset()}>Annuler</Button>
                  <Button variant={'default'} type={'submit'}> Ajouter</Button>

                </>
              )
            }
          </div>
        </form>
      </Form>) : (
        <Form {...formupdate}>
          <form noValidate onSubmit={formupdate.handleSubmit(SubmitUpdate)} className={'grid grid-cols-1 gap-3'}>
            <div className={'grid grid-cols-2 gap-3'}>
              <FormField control={formupdate.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className={'text-red-600'} />
                </FormItem>
              )} name={'nom'} />
              <FormField control={formupdate.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Prenom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className={'text-red-600'} />
                </FormItem>
              )} name={'prenom'} />

              <FormField control={formupdate.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type={'email'} {...field} />
                  </FormControl>
                  <FormMessage className={'text-red-600'} />
                </FormItem>
              )} name={'email'} />

              <FormField control={formupdate.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage className={'text-red-600'} />
                </FormItem>
              )} name={'numero'} />



            </div>
            <div className={'flex flex-row gap-2 justify-center items-center align-middle'}>
              {UserEditMutation.isPending
                ? (
                  <>
                    <CircularProgress size={40} strokeWidth={2}
                      className={'text-yellow-400'} />
                  </>
                )
                : (
                  <>
                    <Button variant={'ghost'} type={'button'}
                      onClick={() => formupdate.reset()}>Annuler</Button>
                    <Button
                      variant={'default'} type={'submit'}>Changer</Button>

                  </>
                )
              }
            </div>
          </form>
        </Form>
      )
  );
};
export default UserForm;