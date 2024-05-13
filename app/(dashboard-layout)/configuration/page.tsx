import {LayoutContent,Layout, LayoutDescription, LayoutHeader, LayoutTitle } from "@/features/page/layout";
import { ConfigurationForm } from "./ConfigurationForm";
import { requiredAuth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";

export default async function page(){
    const user = await requiredAuth();

    const configurations = await prisma.configuration.findMany({
        where:{
            userId: user.id,
        }

        
    })


    console.log(configurations);
    return(
        <Layout>
            <LayoutHeader>
            <LayoutTitle>
                Edit Configuration
            </LayoutTitle>
            <LayoutDescription>
                The configuration define the field you want to fill daily.
                Worker
            </LayoutDescription>
            </LayoutHeader>
            <LayoutContent>
                <ConfigurationForm  configurations={configurations}/>
            </LayoutContent>
            
        </Layout>
    )
}