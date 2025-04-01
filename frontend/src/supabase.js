import { createClient } from "@supabase/supabase-js";


const supabaseUrl= 'https://ojhiywxljnqwoieivyxh.supabase.co';
const   supabaseKey= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaGl5d3hsam5xd29pZWl2eXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwOTQ2MzIsImV4cCI6MjA1NjY3MDYzMn0.Xoxd_Gk1SGai9RxjjOjTckQNPErABLdWchopjiaFqEg' ;


export const supabase = createClient(supabaseUrl, supabaseKey);