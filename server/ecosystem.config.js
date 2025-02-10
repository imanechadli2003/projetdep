module.export={
    apps:[
        {
            name:"projetdep",
            script:"npm",
            args:"run dev",
            env:{
                NODE_ENV:"development",
                ENV_VAR1:"enviroment variable",
            }

        }
    ]
}