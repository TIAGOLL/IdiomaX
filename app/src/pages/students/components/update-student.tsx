import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isSameMonth, setYear as setYearFns } from "date-fns";
import { CalendarIcon, Save } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useStudent } from '../use-student';


export function UpdateStudents() {

    const { watchUpdate, handleSubmitUpdate, errorsUpdate, registerUpdate, setValueUpdate, updateStudent, datesForCalendar, } = useStudent()
    const dateOfBirth = watchUpdate('dateOfBirth')
    const gender = watchUpdate('gender')

    return (
        <div className='mt-10 flex flex-col'>
            <form onSubmit={handleSubmitUpdate(updateStudent)} className='grid grid-cols-8 gap-2'>
                <div className='col-span-8 justify-center items-center grid'>
                    <p className='font-semibold'>Perfil</p>
                </div>
                <div className='col-span-4'>
                    <Label>ID</Label>
                    <Input placeholder="ID" {...registerUpdate('id')} disabled />
                    {errorsUpdate.id && <p className='text-sm text-red-500'>{errorsUpdate.id.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Primeiro nome</Label>
                    <Input placeholder="Primeiro nome" {...registerUpdate('firstName')} />
                    {errorsUpdate.firstName && <p className='text-sm text-red-500'>{errorsUpdate.firstName.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Sobrenome</Label>
                    <Input placeholder="Sobrenome" {...registerUpdate('lastName')} />
                    {errorsUpdate.lastName && <p className='text-sm text-red-500'>{errorsUpdate.lastName.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>CPF</Label>
                    <Input placeholder="CPF" {...registerUpdate('cpf')} maxLength={11} />
                    {errorsUpdate.cpf && <p className='text-sm text-red-500'>{errorsUpdate.cpf.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Telefone</Label>
                    <Input placeholder="Telefone" {...registerUpdate('phone')} maxLength={11} />
                    {errorsUpdate.phone && <p className='text-sm text-red-500'>{errorsUpdate.phone.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Gênero</Label>
                    <Select {...registerUpdate('gender')} onValueChange={(value) => setValueUpdate('gender', value)} value={gender}>
                        <SelectTrigger>
                            <SelectValue placeholder="Gênero" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="M">Masculino</SelectItem>
                                <SelectItem value="F">Feminino</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errorsUpdate.gender && <p className='text-sm text-red-500'>{errorsUpdate.gender.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Data de nascimento</Label>
                    <Popover {...registerUpdate('dateOfBirth')} onValueChange={(value) => setValueUpdate('dateOfBirth', value)}>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "justify-start text-left font-normal w-full",
                                    !dateOfBirth && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateOfBirth ? format(dateOfBirth, "dd/MM/yyyy") : <span>Data de nascimento</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={new Date(dateOfBirth)}
                                onSelect={(value) => setValueUpdate("dateOfBirth", value)}
                                initialFocus
                                month={dateOfBirth}
                                onMonthChange={(month) => {
                                    if (!isSameMonth(month, dateOfBirth)) {
                                        setValueUpdate('dateOfBirth', month)
                                    }
                                }}
                                footer={
                                    <Select
                                        onValueChange={(value) => { setValueUpdate('dateOfBirth', setYearFns(new Date(dateOfBirth), parseInt(value))) }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Ano" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            {
                                                datesForCalendar()?.map((date) => (
                                                    <SelectItem value={date} key={date}>{date}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                }
                            />
                        </PopoverContent>
                    </Popover>
                    {errorsUpdate.dateOfBirth && <p className='text-sm text-red-500'>{errorsUpdate.dateOfBirth.message}</p>}
                </div>
                <div className='col-span-8 justify-center items-center grid mt-4 mb-2'>
                    <p className='font-semibold'>Endereço</p>
                </div>
                <div className='col-span-4'>
                    <Label>CEP</Label>
                    <Input placeholder="CEP" {...registerUpdate('zipCode')} />
                    {errorsUpdate.zipCode && <p className='text-sm text-red-500'>{errorsUpdate.zipCode.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Rua</Label>
                    <Input placeholder="Rua" {...registerUpdate('street')} />
                    {errorsUpdate.street && <p className='text-sm text-red-500'>{errorsUpdate.street.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Bairro</Label>
                    <Input placeholder="Bairro" {...registerUpdate('district')} />
                    {errorsUpdate.district && <p className='text-sm text-red-500'>{errorsUpdate.district.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Número</Label>
                    <Input placeholder="Número" {...registerUpdate('number')} />
                    {errorsUpdate.number && <p className='text-sm text-red-500'>{errorsUpdate.number.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Complemento</Label>
                    <Input placeholder="Complemento" {...registerUpdate('complement')} />
                    {errorsUpdate.complement && <p className='text-sm text-red-500'>{errorsUpdate.complement.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Estado</Label>
                    <Input placeholder="Estado" {...registerUpdate('state')} />
                    {errorsUpdate.state && <p className='text-sm text-red-500'>{errorsUpdate.state.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Cidade</Label>
                    <Input placeholder="Cidade" {...registerUpdate('city')} />
                    {errorsUpdate.city && <p className='text-sm text-red-500'>{errorsUpdate.city.message}</p>}
                </div>
                <div className='col-span-8 justify-center items-center grid mt-4'>
                    <p className='font-semibold'>Credenciais</p>
                </div>
                <div className='col-span-4'>
                    <Label>Email</Label>
                    <Input placeholder="Email" {...registerUpdate('email')} disabled className="rounded-r-none" />
                    {errorsUpdate.email && <p className='text-sm text-red-500'>{errorsUpdate.email.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Usuário</Label>
                    <Input placeholder="Usuário" {...registerUpdate('user')} disabled />
                    {errorsUpdate.user && <p className='text-sm text-red-500'>{errorsUpdate.user.message}</p>}
                </div>
                <Button type="submit" variant="default" className="mt-5">
                    <Save className='w-4 h-4 mr-2' />
                    Salvar
                </Button>
            </form>
        </div>
    );
}