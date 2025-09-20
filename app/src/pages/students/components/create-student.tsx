import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isSameMonth, setYear as setYearFns } from "date-fns";
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { useEffect } from 'react';
import { PasswordGenerator, UserGenerator } from '../../../../lib/utils';
import { useStudent } from "../../../../pages/admin/AdmStudents/useStudent";
import { cn } from '@/lib/utils';

export function CreateStudents() {

    const { watchCreate, handleSubmitCreate, errorsCreate, registerCreate, setValueCreate, createStudent, datesForCalendar } = useStudent()

    const dateOfBirth = watchCreate('dateOfBirth')
    const firstName = watchCreate('firstName')

    useEffect(() => {
        setValueCreate("password", PasswordGenerator(dateOfBirth, firstName?.toLowerCase()))
        setValueCreate("user", UserGenerator(dateOfBirth, firstName?.toLowerCase()))
        if (!dateOfBirth) {
            setValueCreate('dateOfBirth', new Date())
        }
    }, [dateOfBirth, firstName, setValueCreate])

    return (
        <div className='mt-10 flex flex-col w-[1000px]'>
            <form onSubmit={handleSubmitCreate(createStudent)} className='grid grid-cols-8 gap-2'>
                <div className='col-span-8 justify-center items-center grid'>
                    <p className='font-semibold'>Perfil</p>
                </div>
                <div className='col-span-4'>
                    <Label>Primeiro nome</Label>
                    <Input placeholder="Primeiro nome" {...registerCreate('firstName')} />
                    {errorsCreate.firstName && <p className='text-sm text-red-500'>{errorsCreate.firstName.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Sobrenome</Label>
                    <Input placeholder="Sobrenome" {...registerCreate('lastName')} />
                    {errorsCreate.lastName && <p className='text-sm text-red-500'>{errorsCreate.lastName.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>CPF</Label>
                    <Input placeholder="CPF" {...registerCreate('cpf')} value={watchCreate("cpf")} />
                    {errorsCreate.cpf && <p className='text-sm text-red-500'>{errorsCreate.cpf.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Telefone</Label>
                    <Input placeholder="Telefone" {...registerCreate('phone')} maxLength={11} />
                    {errorsCreate.phone && <p className='text-sm text-red-500'>{errorsCreate.phone.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Gênero</Label>
                    <Select {...registerCreate('gender')} onValueChange={(value) => setValueCreate('gender', value)} >
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
                    {errorsCreate.gender && <p className='text-sm text-red-500'>{errorsCreate.gender.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Data de nascimento</Label>
                    <Popover>
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
                                {...registerCreate('dateOfBirth')}
                                mode="single"
                                selected={(new Date(dateOfBirth))}
                                onSelect={(value) => setValueCreate("dateOfBirth", value)}
                                initialFocus
                                month={dateOfBirth}
                                onMonthChange={(month) => {
                                    if (!isSameMonth(month, dateOfBirth)) {
                                        setValueCreate('dateOfBirth', month)
                                    }
                                }}
                                footer={
                                    <Select onValueChange={(value) => { setValueCreate('dateOfBirth', setYearFns(new Date(dateOfBirth), parseInt(value))) }}>
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
                    {errorsCreate.dateOfBirth && <p className='text-sm text-red-500'>{errorsCreate.dateOfBirth.message}</p>}
                </div>
                <div className='col-span-8 justify-center items-center grid mt-4 mb-2'>
                    <p className='font-semibold'>Endereço</p>
                </div>
                <div className='col-span-4'>
                    <Label>CEP</Label>
                    <Input placeholder="CEP" {...registerCreate('zipCode')} maxLength={8} />
                    {errorsCreate.zipCode && <p className='text-sm text-red-500'>{errorsCreate.zipCode.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Rua</Label>
                    <Input placeholder="Rua" {...registerCreate('street')} />
                    {errorsCreate.street && <p className='text-sm text-red-500'>{errorsCreate.street.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Bairro</Label>
                    <Input placeholder="Bairro" {...registerCreate('district')} />
                    {errorsCreate.district && <p className='text-sm text-red-500'>{errorsCreate.district.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Número</Label>
                    <Input placeholder="Número" {...registerCreate('number')} />
                    {errorsCreate.number && <p className='text-sm text-red-500'>{errorsCreate.number.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Complemento</Label>
                    <Input placeholder="Complemento" {...registerCreate('complement')} />
                    {errorsCreate.complement && <p className='text-sm text-red-500'>{errorsCreate.complement.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Estado</Label>
                    <Input placeholder="Estado" {...registerCreate('state')} />
                    {errorsCreate.state && <p className='text-sm text-red-500'>{errorsCreate.state.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Cidade</Label>
                    <Input placeholder="Cidade" {...registerCreate('city')} />
                    {errorsCreate.city && <p className='text-sm text-red-500'>{errorsCreate.city.message}</p>}
                </div>
                <div className='col-span-8 justify-center items-center grid mt-4'>
                    <p className='font-semibold'>Credenciais</p>
                </div>
                <div className='col-span-4'>
                    <Label>Email</Label>
                    <div className='grid grid-cols-2'>
                        <Input placeholder="Email" {...registerCreate('email')} className="rounded-r-none" />
                        <Input placeholder="@school.com" disabled className="rounded-l-none" />
                    </div>
                    {errorsCreate.email && <p className='text-sm text-red-500'>{errorsCreate.email.message}</p>}
                </div>
                <div className='col-span-4'>
                    <div>
                        <Label>Usúario</Label>
                        <Input placeholder="Usúario" type="text" value={UserGenerator(dateOfBirth, firstName?.toLowerCase())} {...registerCreate('user')} />
                    </div>
                    {errorsCreate.user && <p className='text-sm text-red-500'>{errorsCreate.user.message}</p>}
                </div>
                <div className='col-span-4'>
                    <Label>Senha</Label>
                    <Input placeholder="Senha" type="text" value={PasswordGenerator(dateOfBirth, firstName?.toLowerCase())}  {...registerCreate('password')} />
                </div>
                <Button type="submit" variant="default" className="mt-5">
                    <PlusCircle className='w-4 h-4 mr-2' />
                    Cadastrar
                </Button>
            </form >
        </div >
    );
}