//users_form.js / без схеми/ schema = yup
import { useContext } from "react"
import { useForm } from "react-hook-form" //Vers 7.0.X:<input {...register('test', { required: true })} />
import IconCancel from "../../ui/svg/head/IconCancel"
import IconRefresh from "../../ui/svg/table/IconRefresh"
import { ComponentContext } from "../../../context/ComponentContext"

export default function CategoryForm({ onCloseForm, toFormData }) {
  const { state } = useContext(ComponentContext)
  const { theme } = state

  const defaultData = {
    name: "",
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: toFormData ? toFormData : defaultData,
  })

  const onSubmit = (data) => {
    // console.log("***********UsersForm/onSubmit/data=", data)
    // alert(JSON.stringify(data))
    onCloseForm(data) //з закриттям форми передаємо дані у батьківський компонент
  }
  const onCancel = () => {
    onCloseForm(null) //Передаємо дані у батьківський компонент
  }
  return (
    <div className="modal-overley">
      <form className="dataForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-nav">
          <button className="head-nav-button" type="button" onClick={() => reset()} title="Оновити ввід">
            <IconRefresh width={theme.size.formIcon} height={theme.size.formIcon} colorFill={theme.colors.formIcon} />
          </button>
          <input className="inputSubmit" type="submit" />
          <button className="head-nav-button" type="button" onClick={onCancel} title="Вийти без збереження">
            <IconCancel width={theme.size.formIcon} height={theme.size.formIcon} colorFill={theme.colors.formIcon} />
          </button>
        </div>
        <div className="formBody">
          <div className="inputBody" style={{ weight: "250px", margin: "0 10px" }}>
            <label className="label">Назва категорії</label>
            <input className="input" {...register("name", { maxLength: 50 })} required />
            <div className="errorMsg">{errors.name?.type === "maxLength" && "Назва >50симв."}</div>
          </div>
        </div>
      </form>
      {/*  */}
      <style jsx>{`
        // накладання слоїв-затемнення екрану
        .modal-overley {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: ${theme.colors.backgroundEclipse}; //Затемнення екрану
        }
        // Кнопки навігації
        .form-nav {
          display: flex;
          justify-content: space-between;
          padding: 0.2rem;
        }
        .head-nav-button {
          display: flex;
          align-items: center;
          width: ${theme.size.formIconBorder};
          height: ${theme.size.formIconBorder};
          border-radius: ${theme.size.formIconBorder};
          border: 2px solid ${theme.colors.formButtonBorder};
          background-color: ${theme.colors.formBackground};
        }
        .head-nav-button:hover {
          cursor: pointer;
          background-color: ${theme.colors.formIconBackgroundHover};
        }

        //-- з *Form.module.css //
        .dataForm {
          max-width: 100%;
          max-height: 80%;
          position: absolute;
          bottom: 10px;
          padding: 0.12rem;
          border: 2px solid ${theme.colors.formBorder};
          background-color: ${theme.colors.formBackground};
        }

        .formBody {
          display: flex;
          flex-wrap: wrap;
          padding: 0.12rem;
          margin: 5px;
          border: 2px solid ${theme.colors.formBorder};
        }
        .inputSubmit {
          font-weight: bold;
          border: 2px solid ${theme.colors.formButtonBorder};
          color: ${theme.colors.formSubmit};
          background-color: ${theme.colors.formBackground};
        }
        .inputSubmit:hover {
          cursor: pointer;
          color: ${theme.colors.formSubmitHover};
        }
        .inputBody {
          display: flex;
          flex-direction: column;
          margin: 0 1px;
          padding: 0px;
        }
        .inputImgContainer {
          display: flex;
          align-items: center;
        }

        .input {
          //   width: 100%;
          border-radius: 4px;
          padding: 5px 5px;
          margin-bottom: 3px;
          font-size: 13px;
          color: ${theme.colors.formInputText};
          border: 2px solid ${theme.colors.formBorder};
          background-color: ${theme.colors.formInputBackground}; //Затемнення екрану
        }

        .label {
          font-weight: bold;
          font-size: 13px;
          color: ${theme.colors.formLabel};
        }
        .errorMsg {
          text-align: left;
          max-width: 350px;
          font-size: 12px;
          font-weight: 300;
          color: ${theme.colors.errorMsg};
        }
      `}</style>
    </div>
  )
}
